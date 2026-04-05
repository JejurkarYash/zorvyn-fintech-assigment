"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = getSummary;
exports.getCategoryBreakdown = getCategoryBreakdown;
exports.getMonthlyTrends = getMonthlyTrends;
exports.getRecentTransactions = getRecentTransactions;
const prisma_1 = require("../../db/prisma");
const dashboard_service_1 = require("./dashboard.service");
async function getSummary(req, res) {
    try {
        // fetching summary data from database
        const result = await prisma_1.prisma.transactions.groupBy({
            by: ["type"],
            where: { deletedAt: null },
            _sum: {
                amount: true,
            },
            _count: { id: true },
        });
        if (result.length === 0) {
            return res.status(404).json({
                error: {
                    code: "NO_DATA_FOUND",
                    message: "No transactions found in the database",
                },
            });
        }
        const incomeData = result.find((item) => item.type === "INCOME");
        const expenseData = result.find((item) => item.type === "EXPENSE");
        const totalIncome = incomeData?._sum.amount || 0;
        const totalExpense = expenseData?._sum.amount || 0;
        const netBalance = totalIncome - totalExpense;
        const totalTransactions = (incomeData?._count.id || 0) + (expenseData?._count.id || 0);
        const response = {
            totalIncome,
            totalExpense,
            netBalance,
            totalTransactions,
        };
        return res.json(response);
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the summary",
                err,
            },
        });
    }
}
async function getCategoryBreakdown(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const parsedStartDate = startDate
            ? new Date(startDate)
            : undefined;
        const parsedEndDate = endDate ? new Date(endDate) : undefined;
        if (parsedStartDate && isNaN(parsedStartDate.getTime())) {
            return res.status(400).json({
                error: {
                    code: "INVALID_DATE",
                    message: "Invalid startDate format. Use ISO format like 2026-03-01",
                },
            });
        }
        if (parsedEndDate && isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({
                error: {
                    code: "INVALID_DATE",
                    message: "Invalid endDate format. Use ISO format like 2026-03-01",
                },
            });
        }
        if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
            return res.status(400).json({
                error: {
                    code: "INVALID_DATE_RANGE",
                    message: "startDate must be before endDate",
                },
            });
        }
        const categories = await (0, dashboard_service_1.getCategories)(parsedStartDate, parsedEndDate);
        return res.status(200).json({
            message: "Category breakdown fetched successfully",
            ...(parsedStartDate &&
                parsedEndDate && {
                dateRange: {
                    from: parsedStartDate,
                    to: parsedEndDate,
                },
            }),
            categories,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
                err,
            },
        });
    }
}
async function getMonthlyTrends(req, res) {
    try {
        const yearValidation = (0, dashboard_service_1.validateYear)(req.query.year);
        if (!yearValidation.valid) {
            return res.status(400).json({
                error: {
                    code: "INVALID_YEAR",
                    message: yearValidation.error,
                },
            });
        }
        const trends = await (0, dashboard_service_1.fetchMonthlyTrends)(yearValidation.year);
        if (trends.length === 0) {
            return res.status(200).json({
                message: `No transactions found for year ${yearValidation.year || new Date().getFullYear()}`,
                year: yearValidation.year || new Date().getFullYear(),
                trends: [],
            });
        }
        const yearlySummary = {
            totalIncome: trends.reduce((sum, t) => sum + t.income, 0),
            totalExpense: trends.reduce((sum, t) => sum + t.expense, 0),
            netBalance: trends.reduce((sum, t) => sum + t.netBalance, 0),
        };
        return res.status(200).json({
            message: "Monthly trends fetched successfully",
            year: yearValidation.year || new Date().getFullYear(),
            yearlySummary,
            trends,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
            },
        });
    }
}
async function getRecentTransactions(req, res) {
    try {
        const limitParam = req.query.limit;
        if (limitParam) {
            const parsed = parseInt(limitParam);
            if (isNaN(parsed) || parsed <= 0) {
                return res.status(400).json({
                    error: {
                        code: "INVALID_LIMIT",
                        message: "Limit must be a positive number",
                    },
                });
            }
            if (parsed > 50) {
                return res.status(400).json({
                    error: {
                        code: "INVALID_LIMIT",
                        message: "Limit cannot exceed 50",
                    },
                });
            }
        }
        const limit = limitParam ? parseInt(limitParam) : 10;
        const transactions = await (0, dashboard_service_1.fetchRecentTransactions)(limit);
        if (transactions.length === 0) {
            return res.status(200).json({
                message: "No transactions found",
                transactions: [],
            });
        }
        return res.status(200).json({
            message: "Recent transactions fetched successfully",
            limit,
            count: transactions.length,
            transactions,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong",
            },
        });
    }
}
//# sourceMappingURL=dashboard.controller.js.map