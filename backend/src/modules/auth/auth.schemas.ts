import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  referralCode: z.string().optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(3),
  otp: z.string().length(6),
});

export const resetPasswordSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
  resetToken: z.string().optional(),
  otp: z.string().optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(8),
});

export const changePasswordSchema = z.object({
  current: z.string().min(6),
  next: z.string().min(6),
});
