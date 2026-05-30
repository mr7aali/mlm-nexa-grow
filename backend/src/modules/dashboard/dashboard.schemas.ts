import { z } from "zod";

export const createWithdrawalSchema = z.object({
  amount: z.number().min(200),
  method: z.string().min(1),
  account: z.string().min(6),
});
