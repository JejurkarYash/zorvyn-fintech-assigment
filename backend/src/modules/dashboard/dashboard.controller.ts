import type { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import {
  getCategories,
  validateYear,
  fetchMonthlyTrends,
  fetchRecentTransactions,
} from "./dashboard.service";

export async function getSummary(req: Request, res: Response) {
  try {
    // fetching summary data from database
    const result = await prisma.transactions.groupBy({
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
    const totalTransactions =
      (incomeData?._count.id || 0) + (expenseData?._count.id || 0);

    const response = {
      totalIncome,
      totalExpense,
      netBalance,
      totalTransactions,
    };

    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the summary",
        err,
      },
    });
  }
}

export async function getCategoryBreakdown(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    const parsedStartDate = startDate
      ? new Date(startDate as string)
      : undefined;
    const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

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

    const categories = await getCategories(parsedStartDate, parsedEndDate);

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
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        err,
      },
    });
  }
}

export async function getMonthlyTrends(req: Request, res: Response) {
  try {
    const yearValidation = validateYear(req.query.year);

    if (!yearValidation.valid) {
      return res.status(400).json({
        error: {
          code: "INVALID_YEAR",
          message: yearValidation.error,
        },
      });
    }

    const trends = await fetchMonthlyTrends(yearValidation.year);

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
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  }
}

export async function getRecentTransactions(req: Request, res: Response) {
  try {
    const limitParam = req.query.limit;

    if (limitParam) {
      const parsed = parseInt(limitParam as string);

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

    const limit = limitParam ? parseInt(limitParam as string) : 10;

    const transactions = await fetchRecentTransactions(limit);

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
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  }
}
