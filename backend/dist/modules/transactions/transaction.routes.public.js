"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const router = (0, express_1.Router)();
// public routes
router.get("/", transaction_controller_1.getAllTransactions);
router.get("/:id", transaction_controller_1.getTransactionById);
exports.default = router;
//# sourceMappingURL=transaction.routes.public.js.map