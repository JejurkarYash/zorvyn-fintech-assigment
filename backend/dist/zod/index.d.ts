import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        VIEWER: "VIEWER";
        ADMIN: "ADMIN";
        ANALYST: "ANALYST";
    }>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
}, z.core.$strip>;
export declare const changeUserRoleSchema: z.ZodObject<{
    role: z.ZodEnum<{
        VIEWER: "VIEWER";
        ADMIN: "ADMIN";
        ANALYST: "ANALYST";
    }>;
}, z.core.$strip>;
export declare const changeUserStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>;
}, z.core.$strip>;
export declare const createTransactionSchema: z.ZodObject<{
    amount: z.ZodNumber;
    type: z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>;
    category: z.ZodEnum<{
        SALARY: "SALARY";
        RENT: "RENT";
        UTILITIES: "UTILITIES";
        MARKETING: "MARKETING";
        TRAVEL: "TRAVEL";
        FOOD: "FOOD";
        SOFTWARE: "SOFTWARE";
        EQUIPMENT: "EQUIPMENT";
        TAX: "TAX";
        SALES: "SALES";
        CONSULTING: "CONSULTING";
        INVESTMENT: "INVESTMENT";
        REFUND: "REFUND";
        INTEREST: "INTEREST";
        OTHER: "OTHER";
    }>;
    date: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTransactionSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    category: z.ZodOptional<z.ZodEnum<{
        SALARY: "SALARY";
        RENT: "RENT";
        UTILITIES: "UTILITIES";
        MARKETING: "MARKETING";
        TRAVEL: "TRAVEL";
        FOOD: "FOOD";
        SOFTWARE: "SOFTWARE";
        EQUIPMENT: "EQUIPMENT";
        TAX: "TAX";
        SALES: "SALES";
        CONSULTING: "CONSULTING";
        INVESTMENT: "INVESTMENT";
        REFUND: "REFUND";
        INTEREST: "INTEREST";
        OTHER: "OTHER";
    }>>;
    date: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
