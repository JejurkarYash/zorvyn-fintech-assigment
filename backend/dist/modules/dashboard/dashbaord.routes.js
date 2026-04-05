"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
router.get("/summary", dashboard_controller_1.getSummary);
router.get("/categories", dashboard_controller_1.getCategoryBreakdown);
router.get("/trends", dashboard_controller_1.getMonthlyTrends);
router.get("/recent-transactions", dashboard_controller_1.getRecentTransactions);
exports.default = router;
//# sourceMappingURL=dashbaord.routes.js.map