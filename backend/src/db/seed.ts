import dotenv from "dotenv";
import {
  Role,
  Status,
  Type,
  Category,
  AuditAction,
  AuditEntity,
} from "@prisma/client";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";

dotenv.config();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
  const hashedAnalystPassword = await bcrypt.hash("Analyst@123", 10);
  const hashedViewerPassword = await bcrypt.hash("Viewer@123", 10);

  const admin = await prisma.users.create({
    data: {
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedAdminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analyst = await prisma.users.create({
    data: {
      name: "Finance Analyst",
      email: "analyst@gmail.com",
      password: hashedAnalystPassword,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  const viewer = await prisma.users.create({
    data: {
      name: "Dashboard Viewer",
      email: "viewer@gmail.com",
      password: hashedViewerPassword,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  console.log("👥 Created users");

  const transactions = [
    {
      amount: 200000,
      type: "INCOME",
      category: "SALES",
      description: "Q4 client payment - TechCorp",
      date: new Date("2026-01-05"),
      userId: admin.id,
    },
    {
      amount: 80000,
      type: "EXPENSE",
      category: "SALARY",
      description: "January salary payout",
      date: new Date("2026-01-31"),
      userId: admin.id,
    },
    {
      amount: 50000,
      type: "EXPENSE",
      category: "RENT",
      description: "January office rent - Bengaluru",
      date: new Date("2026-01-01"),
      userId: admin.id,
    },
    {
      amount: 15000,
      type: "EXPENSE",
      category: "SOFTWARE",
      description: "AWS monthly subscription",
      date: new Date("2026-01-10"),
      userId: admin.id,
    },
    {
      amount: 8000,
      type: "EXPENSE",
      category: "UTILITIES",
      description: "Electricity and internet bill",
      date: new Date("2026-01-15"),
      userId: admin.id,
    },

    {
      amount: 250000,
      type: "INCOME",
      category: "CONSULTING",
      description: "Consulting fee - FinanceHub",
      date: new Date("2026-02-10"),
      userId: admin.id,
    },
    {
      amount: 80000,
      type: "EXPENSE",
      category: "SALARY",
      description: "February salary payout",
      date: new Date("2026-02-28"),
      userId: admin.id,
    },
    {
      amount: 50000,
      type: "EXPENSE",
      category: "RENT",
      description: "February office rent - Bengaluru",
      date: new Date("2026-02-01"),
      userId: admin.id,
    },
    {
      amount: 20000,
      type: "EXPENSE",
      category: "MARKETING",
      description: "Google ads campaign",
      date: new Date("2026-02-15"),
      userId: admin.id,
    },

    // March
    {
      amount: 180000,
      type: "INCOME",
      category: "SALES",
      description: "Product subscription revenue",
      date: new Date("2026-03-05"),
      userId: admin.id,
    },
    {
      amount: 30000,
      type: "INCOME",
      category: "REFUND",
      description: "Vendor refund - Microsoft",
      date: new Date("2026-03-10"),
      userId: admin.id,
    },
    {
      amount: 80000,
      type: "EXPENSE",
      category: "SALARY",
      description: "March salary payout",
      date: new Date("2026-03-31"),
      userId: admin.id,
    },
    {
      amount: 50000,
      type: "EXPENSE",
      category: "RENT",
      description: "March office rent - Bengaluru",
      date: new Date("2026-03-01"),
      userId: admin.id,
    },
    {
      amount: 12000,
      type: "EXPENSE",
      category: "TRAVEL",
      description: "Client visit - Mumbai",
      date: new Date("2026-03-20"),
      userId: admin.id,
    },
    {
      amount: 5000,
      type: "EXPENSE",
      category: "FOOD",
      description: "Team lunch",
      date: new Date("2026-03-25"),
      userId: admin.id,
    },

    // April
    {
      amount: 220000,
      type: "INCOME",
      category: "SALES",
      description: "Q1 payment - DataSync client",
      date: new Date("2026-04-02"),
      userId: admin.id,
    },
    {
      amount: 80000,
      type: "EXPENSE",
      category: "SALARY",
      description: "April salary payout",
      date: new Date("2026-04-30"),
      userId: admin.id,
    },
    {
      amount: 55000,
      type: "EXPENSE",
      category: "RENT",
      description: "April office rent - Bengaluru",
      date: new Date("2026-04-01"),
      userId: admin.id,
    },
    {
      amount: 25000,
      type: "EXPENSE",
      category: "EQUIPMENT",
      description: "New laptops for team",
      date: new Date("2026-04-03"),
      userId: admin.id,
    },
    {
      amount: 18000,
      type: "EXPENSE",
      category: "TAX",
      description: "Quarterly tax payment",
      date: new Date("2026-04-15"),
      userId: admin.id,
    },
  ];

  await prisma.transactions.createMany({
    // @ts-ignore
    data: transactions,
  });

  console.log(`💰 Created ${transactions.length} transactions`);

  await prisma.auditLogs.createMany({
    data: [
      {
        userId: admin.id,
        action: AuditAction.CREATE_USER,
        entity: AuditEntity.USER,
        entityId: analyst.id,
      },
      {
        userId: admin.id,
        action: AuditAction.CREATE_USER,
        entity: AuditEntity.USER,
        entityId: viewer.id,
      },
      {
        userId: admin.id,
        action: AuditAction.CREATE_TRANSACTION,
        entity: AuditEntity.TRANSACTION,
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
    await prisma.$disconnect();
  });
