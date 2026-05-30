import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["Active", "Inactive", "Banned"]),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["member", "admin", "super-admin"]),
});

export const creditCommissionSchema = z.object({
  user: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().min(3),
});

export const broadcastSchema = z.object({
  message: z.string().min(5),
});

export const updateWithdrawalStatusSchema = z.object({
  status: z.enum(["Pending", "Review", "Paid", "Rejected"]),
});

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
  z.number().nonnegative().optional(),
);

const productDetailsSchema = z.array(z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
}));

export const createProductSchema = z.object({
  id: z.string().trim().min(2).optional(),
  icon: z.string().trim().optional(),
  image: z.string().trim().min(1),
  name: z.string().trim().min(2),
  category: z.string().trim().min(2),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  discountPercent: optionalNumber,
  offer: z.string().trim().optional(),
  offerEnds: z.string().trim().optional(),
  commission: optionalNumber,
  stock: z.string().trim().optional(),
  sku: z.string().trim().min(2),
  delivery: z.string().trim().optional(),
  description: z.string().trim().optional(),
  full: z.string().trim().optional(),
  highlights: z.array(z.string().trim().min(1)).optional(),
  includes: z.array(z.string().trim().min(1)).optional(),
  details: productDetailsSchema.optional(),
});

export const updateProductSchema = createProductSchema
  .omit({ id: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one product field is required",
  });
