import { Router } from "express";
import {
  getCategoryBreakdown,
  getRecentTransactions,
  getMonthlyTrends,
  getSummary,
} from "./dashboard.controller";

const router: Router = Router();

router.get("/summary", getSummary);
router.get("/categories", getCategoryBreakdown);
router.get("/trends", getMonthlyTrends);
router.get("/recent-transactions", getRecentTransactions);

export default router;
