"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = exports.changeUserStatusSchema = exports.changeUserRoleSchema = exports.createUserSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Auth Schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
//  user schema
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["VIEWER", "ADMIN", "ANALYST"]),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
exports.changeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["VIEWER", "ADMIN", "ANALYST"]),
});
exports.changeUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]),
});
// Transaction schema
exports.createTransactionSchema = zod_1.z.object({
    amount: zod_1.z.number().positive({ message: "Amount must be a positive number" }),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]),
    category: zod_1.z.enum([
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
    date: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format. Use ISO format like 2026-03-01",
    })
        .transform((val) => new Date(val)),
    description: zod_1.z
        .string()
        .max(500, {
        message: "Description cannot exceed 500 characters",
    })
        .optional(),
});
exports.updateTransactionSchema = exports.createTransactionSchema.partial();
//# sourceMappingURL=index.js.map