"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.fetchMonthlyTrends = fetchMonthlyTrends;
exports.validateYear = validateYear;
exports.fetchRecentTransactions = fetchRecentTransactions;
const prisma_1 = require("../../db/prisma");
async function getCategories(startDate, endDate) {
    const result = await prisma_1.prisma.transactions.groupBy({
        by: ["category", "type"],
        where: {
            deletedAt: null,
            ...(startDate &&
                endDate && {
                date: { gte: startDate, lte: endDate },
            }),
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: {
            _sum: { amount: "desc" },
        },
    });
    return result.map((item) => ({
        category: item.category,
        type: item.type,
        total: item._sum.amount || 0,
        count: item._count.id,
    }));
}
async function fetchMonthlyTrends(year) {
    const selectedYear = year || new Date().getFullYear();
    const transactions = await prisma_1.prisma.transactions.findMany({
        where: {
            deletedAt: null,
            date: {
                gte: new Date(`${selectedYear}-01-01`),
                lte: new Date(`${selectedYear}-12-31`),
            },
        },
        select: {
            amount: true,
            type: true,
            date: true,
        },
    });
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthlyData = monthNames.map((month, index) => ({
        month,
        monthNumber: index + 1,
        year: selectedYear,
        income: 0,
        expense: 0,
        netBalance: 0,
    }));
    transactions.forEach((transaction) => {
        const monthIndex = new Date(transaction.date).getMonth();
        if (transaction.type === "INCOME") {
            monthlyData[monthIndex].income += transaction.amount;
        }
        else {
            monthlyData[monthIndex].expense += transaction.amount;
        }
    });
    monthlyData.forEach((month) => {
        month.netBalance = month.income - month.expense;
    });
    return monthlyData;
}
function validateYear(yearParam) {
    if (!yearParam)
        return { valid: true };
    const parsed = parseInt(yearParam);
    if (isNaN(parsed)) {
        return {
            valid: false,
            error: "Invalid year format. Use a number like 2026",
        };
    }
    if (parsed < 2000 || parsed > 2100) {
        return {
            valid: false,
            error: "Year must be between 2000 and 2100",
        };
    }
    return { valid: true, year: parsed };
}
async function fetchRecentTransactions(limit) {
    const transactions = await prisma_1.prisma.transactions.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: {
            date: "desc",
        },
        take: limit || 10,
        select: {
            id: true,
            amount: true,
            type: true,
            category: true,
            date: true,
            description: true,
            createdAt: true,
        },
    });
    return transactions;
}
//# sourceMappingURL=dashboard.service.js.map