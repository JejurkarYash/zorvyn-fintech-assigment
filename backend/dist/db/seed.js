"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wasm_1 = require("@prisma/client/wasm");
const prisma_1 = require("../db/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    console.log("🌱 Seeding database...");
    const hashedAdminPassword = await bcrypt_1.default.hash("Admin@123", 10);
    const hashedAnalystPassword = await bcrypt_1.default.hash("Analyst@123", 10);
    const hashedViewerPassword = await bcrypt_1.default.hash("Viewer@123", 10);
    const admin = await prisma_1.prisma.users.create({
        data: {
            name: "Super Admin",
            email: "admin@gmail.com",
            password: hashedAdminPassword,
            role: wasm_1.Role.ADMIN,
            status: wasm_1.Status.ACTIVE,
        },
    });
    const analyst = await prisma_1.prisma.users.create({
        data: {
            name: "Finance Analyst",
            email: "analyst@gmail.com",
            password: hashedAnalystPassword,
            role: wasm_1.Role.ANALYST,
            status: wasm_1.Status.ACTIVE,
        },
    });
    const viewer = await prisma_1.prisma.users.create({
        data: {
            name: "Dashboard Viewer",
            email: "viewer@gmail.com",
            password: hashedViewerPassword,
            role: wasm_1.Role.VIEWER,
            status: wasm_1.Status.ACTIVE,
        },
    });
    console.log("👥 Created users");
    const transactions = [
        {
            amount: 200000,
            type: wasm_1.Type.INCOME,
            category: wasm_1.Category.SALES,
            description: "Q4 client payment - TechCorp",
            date: new Date("2026-01-05"),
            userId: admin.id,
        },
        {
            amount: 80000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.SALARY,
            description: "January salary payout",
            date: new Date("2026-01-31"),
            userId: admin.id,
        },
        {
            amount: 50000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.RENT,
            description: "January office rent - Bengaluru",
            date: new Date("2026-01-01"),
            userId: admin.id,
        },
        {
            amount: 15000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.SOFTWARE,
            description: "AWS monthly subscription",
            date: new Date("2026-01-10"),
            userId: admin.id,
        },
        {
            amount: 8000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.UTILITIES,
            description: "Electricity and internet bill",
            date: new Date("2026-01-15"),
            userId: admin.id,
        },
        {
            amount: 250000,
            type: wasm_1.Type.INCOME,
            category: wasm_1.Category.CONSULTING,
            description: "Consulting fee - FinanceHub",
            date: new Date("2026-02-10"),
            userId: admin.id,
        },
        {
            amount: 80000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.SALARY,
            description: "February salary payout",
            date: new Date("2026-02-28"),
            userId: admin.id,
        },
        {
            amount: 50000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.RENT,
            description: "February office rent - Bengaluru",
            date: new Date("2026-02-01"),
            userId: admin.id,
        },
        {
            amount: 20000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.MARKETING,
            description: "Google ads campaign",
            date: new Date("2026-02-15"),
            userId: admin.id,
        },
        // March
        {
            amount: 180000,
            type: wasm_1.Type.INCOME,
            category: wasm_1.Category.SALES,
            description: "Product subscription revenue",
            date: new Date("2026-03-05"),
            userId: admin.id,
        },
        {
            amount: 30000,
            type: wasm_1.Type.INCOME,
            category: wasm_1.Category.REFUND,
            description: "Vendor refund - Microsoft",
            date: new Date("2026-03-10"),
            userId: admin.id,
        },
        {
            amount: 80000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.SALARY,
            description: "March salary payout",
            date: new Date("2026-03-31"),
            userId: admin.id,
        },
        {
            amount: 50000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.RENT,
            description: "March office rent - Bengaluru",
            date: new Date("2026-03-01"),
            userId: admin.id,
        },
        {
            amount: 12000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.TRAVEL,
            description: "Client visit - Mumbai",
            date: new Date("2026-03-20"),
            userId: admin.id,
        },
        {
            amount: 5000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.FOOD,
            description: "Team lunch",
            date: new Date("2026-03-25"),
            userId: admin.id,
        },
        // April
        {
            amount: 220000,
            type: wasm_1.Type.INCOME,
            category: wasm_1.Category.SALES,
            description: "Q1 payment - DataSync client",
            date: new Date("2026-04-02"),
            userId: admin.id,
        },
        {
            amount: 80000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.SALARY,
            description: "April salary payout",
            date: new Date("2026-04-30"),
            userId: admin.id,
        },
        {
            amount: 55000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.RENT,
            description: "April office rent - Bengaluru",
            date: new Date("2026-04-01"),
            userId: admin.id,
        },
        {
            amount: 25000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.EQUIPMENT,
            description: "New laptops for team",
            date: new Date("2026-04-03"),
            userId: admin.id,
        },
        {
            amount: 18000,
            type: wasm_1.Type.EXPENSE,
            category: wasm_1.Category.TAX,
            description: "Quarterly tax payment",
            date: new Date("2026-04-15"),
            userId: admin.id,
        },
    ];
    await prisma_1.prisma.transactions.createMany({
        data: transactions,
    });
    console.log(`💰 Created ${transactions.length} transactions`);
    await prisma_1.prisma.auditLogs.createMany({
        data: [
            {
                userId: admin.id,
                action: wasm_1.AuditAction.CREATE_USER,
                entity: wasm_1.AuditEntity.USER,
                entityId: analyst.id,
            },
            {
                userId: admin.id,
                action: wasm_1.AuditAction.CREATE_USER,
                entity: wasm_1.AuditEntity.USER,
                entityId: viewer.id,
            },
            {
                userId: admin.id,
                action: wasm_1.AuditAction.CREATE_TRANSACTION,
                entity: wasm_1.AuditEntity.TRANSACTION,
                entityId: "seeded",
            },
        ],
    });
}
main()
    .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map