import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().min(1).max(10),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional().default(""),
  customerName: z.string().min(3, "Customer name must be at least 3 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  address: z.string().min(8, "Delivery address must be at least 8 characters"),
  paymentMethod: z.string().min(3, "Payment method is required"),
});
