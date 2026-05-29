import type { NextFunction, Request, Response } from "express";
import { findUserById } from "../database/store";
import type { Role } from "../types/domain";
import { HttpError } from "../utils/http-error";
import { verifyAccessToken } from "../modules/auth/auth.service";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    next(new HttpError(401, "Access token is required"));
    return;
  }

  const decoded = verifyAccessToken(token);
  const user = await findUserById(decoded.sub);

  if (!user) {
    next(new HttpError(401, "User does not exist"));
    return;
  }

  if (user.status === "Banned") {
    next(new HttpError(403, "This account is blocked"));
    return;
  }

  req.auth = {
    userId: user.id,
    role: user.role,
  };

  next();
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.auth?.role !== role) {
      next(new HttpError(403, "You do not have permission for this action"));
      return;
    }

    next();
  };
}
