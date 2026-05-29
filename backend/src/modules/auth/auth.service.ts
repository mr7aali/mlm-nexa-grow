import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes, randomUUID } from "node:crypto";
import type { Response } from "express";
import { env, isProduction } from "../../config/env";
import {
  findUserByEmail,
  findUserById,
  ActivityModel,
  ReferralModel,
  RefreshTokenModel,
  UserModel,
  toPublicUser,
} from "../../database/store";
import type { UserDocumentLike } from "../../database/models";
import type { PublicUser, Role } from "../../types/domain";
import { HttpError } from "../../utils/http-error";

const refreshCookieName = "gioto_refresh_token";
const accessTokenTtl = "15m";
const refreshTokenTtl = "7d";
const refreshTokenMs = 7 * 24 * 60 * 60 * 1000;
const resetTokenMs = 10 * 60 * 1000;
const demoOtp = "246810";

type TokenPayload = {
  sub: string;
  role: Role;
};

function signAccessToken(user: UserDocumentLike) {
  return jwt.sign(
    { sub: user.id, role: user.role } satisfies TokenPayload,
    env.accessTokenSecret,
    { expiresIn: accessTokenTtl },
  );
}

function signRefreshToken(user: UserDocumentLike) {
  return jwt.sign(
    { sub: user.id, role: user.role } satisfies TokenPayload,
    env.refreshTokenSecret,
    { expiresIn: refreshTokenTtl },
  );
}

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(refreshCookieName, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: refreshTokenMs,
    path: "/",
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });
}

async function createAuthPayload(user: UserDocumentLike, res: Response) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await RefreshTokenModel.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: Date.now() + refreshTokenMs,
  });
  setRefreshCookie(res, refreshToken);

  return {
    accessToken,
    user: toPublicUser(user),
  };
}

export async function register(values: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}, res: Response) {
  if (await findUserByEmail(values.email)) {
    throw new HttpError(409, "This email is already registered");
  }

  const sponsorCode = values.referralCode?.trim();
  const sponsor = sponsorCode
    ? await UserModel.findOne({ referralCode: sponsorCode })
    : null;

  if (sponsorCode && !sponsor) {
    throw new HttpError(400, "Referral code is invalid");
  }

  const user = await UserModel.create({
    id: randomUUID(),
    name: values.fullName,
    email: values.email.trim().toLowerCase(),
    phone: values.phone,
    level: 1,
    status: "Active",
    referralCode: `GIOTO-${randomBytes(3).toString("hex").toUpperCase()}`,
    joined: new Date().toISOString(),
    earned: 0,
    referrals: 0,
    role: "member",
    referredByUserId: sponsor?.id ?? null,
    referredByCode: sponsorCode || null,
    passwordHash: await bcrypt.hash(values.password, 10),
  });

  if (sponsor) {
    const directReferrals = await ReferralModel.countDocuments({
      ownerUserId: sponsor.id,
    });

    await Promise.all([
      ReferralModel.create({
        id: randomUUID(),
        ownerUserId: sponsor.id,
        userId: user.id,
        name: user.name,
        phone: user.phone,
        level: 1,
        joinDate: user.joined,
        referralCount: 0,
        status: "Active",
        commissionEarned: 0,
        downline: 0,
      }),
      ActivityModel.create({
        id: randomUUID(),
        ownerUserId: sponsor.id,
        text: `${user.name} joined your network`,
        time: new Date().toISOString(),
      }),
      UserModel.updateOne(
        { id: sponsor.id },
        { $set: { referrals: directReferrals + 1 } },
      ),
    ]);
  }

  return createAuthPayload(user, res);
}

export async function login(
  values: { email: string; password: string },
  res: Response,
) {
  const user = await findUserByEmail(values.email);

  if (!user || !(await bcrypt.compare(values.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }

  if (user.status === "Banned") {
    throw new HttpError(403, "This account is not allowed to sign in");
  }

  return createAuthPayload(user, res);
}

export async function refresh(refreshToken: string | undefined, res: Response) {
  if (!refreshToken) {
    throw new HttpError(401, "Refresh token is missing");
  }

  const session = await RefreshTokenModel.findOne({ token: refreshToken });
  if (!session || session.expiresAt < Date.now()) {
    await RefreshTokenModel.deleteOne({ token: refreshToken });
    throw new HttpError(401, "Refresh session has expired");
  }

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(refreshToken, env.refreshTokenSecret) as TokenPayload;
  } catch {
    await RefreshTokenModel.deleteOne({ token: refreshToken });
    throw new HttpError(401, "Refresh token is invalid");
  }

  const user = await findUserById(decoded.sub);
  if (!user || user.status === "Banned") {
    throw new HttpError(401, "User is not available");
  }

  await RefreshTokenModel.deleteOne({ token: refreshToken });
  return createAuthPayload(user, res);
}

export async function logout(refreshToken: string | undefined, res: Response) {
  if (refreshToken) {
    await RefreshTokenModel.deleteOne({ token: refreshToken });
  }

  clearRefreshCookie(res);
  return { loggedOut: true };
}

export function verifyAccessToken(accessToken: string) {
  try {
    return jwt.verify(accessToken, env.accessTokenSecret) as TokenPayload;
  } catch {
    throw new HttpError(401, "Access token is invalid or expired");
  }
}

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email);

  if (user) {
    user.resetOtp = demoOtp;
    user.resetOtpExpiresAt = Date.now() + resetTokenMs;
    await user.save();
  }

  return {
    identifier: email.trim().toLowerCase(),
    otp: demoOtp,
  };
}

export async function verifyOtp(identifier: string, otp: string) {
  const user = await findUserByEmail(identifier);

  if (!user || user.resetOtp !== otp || (user.resetOtpExpiresAt ?? 0) < Date.now()) {
    throw new HttpError(400, "OTP is invalid or expired");
  }

  user.resetToken = randomBytes(24).toString("hex");
  user.resetTokenExpiresAt = Date.now() + resetTokenMs;
  await user.save();

  return {
    identifier: user.email,
    resetToken: user.resetToken,
  };
}

export async function resetPassword(values: {
  identifier: string;
  password: string;
  resetToken?: string;
  otp?: string;
}) {
  const user = await findUserByEmail(values.identifier);

  const resetTokenValid =
    user?.resetToken &&
    user.resetToken === values.resetToken &&
    (user.resetTokenExpiresAt ?? 0) > Date.now();
  const otpValid =
    user?.resetOtp &&
    user.resetOtp === values.otp &&
    (user.resetOtpExpiresAt ?? 0) > Date.now();

  if (!user || (!resetTokenValid && !otpValid)) {
    throw new HttpError(400, "Password reset token is invalid or expired");
  }

  user.passwordHash = await bcrypt.hash(values.password, 10);
  user.resetOtp = undefined;
  user.resetOtpExpiresAt = undefined;
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  return { updated: true };
}

export async function getMe(userId: string): Promise<PublicUser> {
  const user = await findUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return toPublicUser(user);
}

export async function updateProfile(
  userId: string,
  values: { fullName: string; phone: string },
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  user.name = values.fullName;
  user.phone = values.phone;
  await user.save();

  return toPublicUser(user);
}

export async function changePassword(
  userId: string,
  values: { current: string; next: string },
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (!(await bcrypt.compare(values.current, user.passwordHash))) {
    throw new HttpError(400, "Current password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(values.next, 10);
  await user.save();
  return { updated: true };
}
