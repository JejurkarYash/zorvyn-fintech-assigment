import type { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { createTransactionSchema, updateTransactionSchema } from "../../zod";

export async function createTransaction(req: Request, res: Response) {
  try {
    const parsedBody = createTransactionSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: "Invalid input data",
          errorDetails: parsedBody.error.flatten(),
        },
      });
    }

    const { amount, type, category, date, description } = parsedBody.data;
    const userId = req.user?.userId as string;

    const newTransaction = await prisma.transactions.create({
      data: {
        amount,
        type,
        category,
        date,
        description,
        userId,
      },
    });

    return res.status(201).json({ transaction: newTransaction });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}

export async function getAllTransactions(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const transactions = await prisma.transactions.findMany({
      where: {
        deletedAt: null, // only fetching non-deleted transactions
      },
      take: limit,
      skip: offset,
    });

    if (transactions.length === 0) {
      return res.status(404).json({
        error: {
          code: "NO_TRANSACTIONS_FOUND",
          message: "No transactions found in the database",
        },
      });
    }

    return res.status(200).json({ transactions });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}

export async function getTransactionById(req: Request, res: Response) {
  try {
    const transactionId = req.params.id as string;

    // getting transaction by id
    const transaction = await prisma.transactions.findUnique({
      where: {
        deletedAt: null,
        id: transactionId,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        error: {
          code: "TRANSACTION_NOT_FOUND",
          message: "Transaction not found",
        },
      });
    }

    return res.status(200).json({ transaction });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  try {
    const parsedBody = updateTransactionSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: "Invalid input data",
          errorDetails: parsedBody.error.flatten(),
        },
      });
    }
    const transactionId = req.params.id as string;

    // checking if transaction exists or not
    const existingTransaction = await prisma.transactions.findUnique({
      where: {
        deletedAt: null,
        id: transactionId,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        error: {
          code: "TRANSACTION_NOT_FOUND",
          message: "Transaction not found",
        },
      });
    }

    // updating transaction
    const updatedTransaction = await prisma.transactions.update({
      where: {
        id: transactionId,
      },
      data: parsedBody.data,
    });

    return res.status(200).json({ transaction: updatedTransaction });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}

export async function restoreTransaction(req: Request, res: Response) {
  try {
    const transactionId = req.params.id as string;

    // checking if transaction exists or not
    const existingTransaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        error: {
          code: "TRANSACTION_NOT_FOUND",
          message: "Transaction not found",
        },
      });
    }

    // restoring transaction - setting deletedAt to null
    const restoredTransaction = await prisma.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        deletedAt: null,
      },
    });

    return res.status(200).json({ transaction: restoredTransaction });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const transactionId = req.params.id as string;

    // soft delete - setting isDeleted to true
    const deletedTransaction = await prisma.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return res.status(200).json({ transaction: deletedTransaction });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}

export async function getDeletedTransactions(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const deletedTransactions = await prisma.transactions.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      skip: offset,
      take: limit,
    });

    if (deletedTransactions.length === 0) {
      return res.status(404).json({
        error: {
          code: "NO_DELETED_TRANSACTIONS_FOUND",
          message: "No deleted transactions found in the database",
        },
      });
    }

    return res.status(200).json({ transactions: deletedTransactions });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        err,
      },
    });
  }
}
