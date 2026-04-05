import { z } from "zod";

// Auth Schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

//  user schema
export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["VIEWER", "ADMIN", "ANALYST"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const changeUserRoleSchema = z.object({
  role: z.enum(["VIEWER", "ADMIN", "ANALYST"]),
});

export const changeUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

// Transaction schema
export const createTransactionSchema = z.object({
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum([
    "SALARY",
    "RENT",
    "UTILITIES",
    "MARKETING",
    "TRAVEL",
    "FOOD",
    "SOFTWARE",
    "EQUIPMENT",
    "TAX",
    "SALES",
    "CONSULTING",
    "INVESTMENT",
    "REFUND",
    "INTEREST",
    "OTHER",
  ]),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Use ISO format like 2026-03-01",
    })
    .transform((val) => new Date(val)),
  description: z
    .string()
    .max(500, {
      message: "Description cannot exceed 500 characters",
    })
    .optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();
