import { Router } from "express";
import { deflate } from "node:zlib";
import {
  getAllTransactions,
  getTransactionById,
} from "./transaction.controller";

const router: Router = Router();

// public routes
router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);

export default router;
