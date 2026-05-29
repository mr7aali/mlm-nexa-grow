import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  customerName: z.string().min(3),
  phone: z.string().min(8),
  address: z.string().min(8),
  paymentMethod: z.string().min(3),
});
