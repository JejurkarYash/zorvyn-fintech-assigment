import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getDeletedTransactions,
  updateTransaction,
  restoreTransaction,
} from "./transaction.controller";
const router: Router = Router();

// admin - protected routes
router.post("/", createTransaction);
router.patch("/:id", updateTransaction);
router.patch("/delete/:id", deleteTransaction);
router.patch("/restore/:id", restoreTransaction); // same controller, just different route to handle restore logic
router.get("/deleted", getDeletedTransactions);

export default router;
        