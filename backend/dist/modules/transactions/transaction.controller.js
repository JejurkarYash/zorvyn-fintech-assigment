"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
exports.getAllTransactions = getAllTransactions;
exports.getTransactionById = getTransactionById;
exports.updateTransaction = updateTransaction;
exports.restoreTransaction = restoreTransaction;
exports.deleteTransaction = deleteTransaction;
exports.getDeletedTransactions = getDeletedTransactions;
const prisma_1 = require("../../db/prisma");
const zod_1 = require("../../zod");
async function createTransaction(req, res) {
    try {
        const parsedBody = zod_1.createTransactionSchema.safeParse(req.body);
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
        const userId = req.user?.userId;
        const newTransaction = await prisma_1.prisma.transactions.create({
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
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
async function getAllTransactions(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const transactions = await prisma_1.prisma.transactions.findMany({
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
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
async function getTransactionById(req, res) {
    try {
        const transactionId = req.params.id;
        // getting transaction by id
        const transaction = await prisma_1.prisma.transactions.findUnique({
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
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
async function updateTransaction(req, res) {
    try {
        const parsedBody = zod_1.updateTransactionSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid input data",
                    errorDetails: parsedBody.error.flatten(),
                },
            });
        }
        const transactionId = req.params.id;
        // checking if transaction exists or not
        const existingTransaction = await prisma_1.prisma.transactions.findUnique({
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
        const updatedTransaction = await prisma_1.prisma.transactions.update({
            where: {
                id: transactionId,
            },
            data: parsedBody.data,
        });
        return res.status(200).json({ transaction: updatedTransaction });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
async function restoreTransaction(req, res) {
    try {
        const transactionId = req.params.id;
        // checking if transaction exists or not
        const existingTransaction = await prisma_1.prisma.transactions.findUnique({
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
        const restoredTransaction = await prisma_1.prisma.transactions.update({
            where: {
                id: transactionId,
            },
            data: {
                deletedAt: null,
            },
        });
        return res.status(200).json({ transaction: restoredTransaction });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
async function deleteTransaction(req, res) {
    try {
        const transactionId = req.params.id;
        // soft delete - setting isDeleted to true
        const deletedTransaction = await prisma_1.prisma.transactions.update({
            where: {
                id: transactionId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        return res.status(200).json({ transaction: deletedTransaction });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
async function getDeletedTransactions(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const deletedTransactions = await prisma_1.prisma.transactions.findMany({
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
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                err,
            },
        });
    }
}
//# sourceMappingURL=transaction.controller.js.map