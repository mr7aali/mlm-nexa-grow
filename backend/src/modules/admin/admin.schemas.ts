import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["Active", "Inactive", "Banned"]),
});

export const creditCommissionSchema = z.object({
  user: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().min(3),
});

export const broadcastSchema = z.object({
  message: z.string().min(5),
});
