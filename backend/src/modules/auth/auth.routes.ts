import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import { ok } from "../../utils/api-response";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from "./auth.schemas";
import {
  changePassword,
  getMe,
  login,
  logout,
  refresh,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  verifyOtp,
} from "./auth.service";

export const authRouter = Router();

authRouter.post("/register", (_req, res) => {
  res.status(410).json({
    success: false,
    message: "Registration is only available through product checkout",
  });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    res.json(ok(await login(req.body, res), "Signed in"));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    res.json(ok(await refresh(req.cookies?.gioto_refresh_token, res), "Token refreshed"));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    res.json(ok(await logout(req.cookies?.gioto_refresh_token, res), "Signed out"));
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    res.json(ok(await getMe(req.auth!.userId)));
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      res.json(ok(await requestPasswordReset(req.body.email), "OTP sent"));
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post("/verify-otp", validateBody(verifyOtpSchema), async (req, res, next) => {
  try {
    res.json(ok(await verifyOtp(req.body.identifier, req.body.otp), "OTP verified"));
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  async (req, res, next) => {
    try {
      res.json(ok(await resetPassword(req.body), "Password updated"));
    } catch (error) {
      next(error);
    }
  },
);

authRouter.patch(
  "/profile",
  requireAuth,
  validateBody(updateProfileSchema),
  async (req, res, next) => {
    try {
      res.json(ok(await updateProfile(req.auth!.userId, req.body), "Profile updated"));
    } catch (error) {
      next(error);
    }
  },
);

authRouter.patch(
  "/password",
  requireAuth,
  validateBody(changePasswordSchema),
  async (req, res, next) => {
    try {
      res.json(ok(await changePassword(req.auth!.userId, req.body), "Password changed"));
    } catch (error) {
      next(error);
    }
  },
);
