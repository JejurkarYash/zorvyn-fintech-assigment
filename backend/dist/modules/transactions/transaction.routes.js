"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const router = (0, express_1.Router)();
// admin - protected routes
router.post("/", transaction_controller_1.createTransaction);
router.patch("/:id", transaction_controller_1.updateTransaction);
router.patch("/delete/:id", transaction_controller_1.deleteTransaction);
router.patch("/restore/:id", transaction_controller_1.restoreTransaction); // same controller, just different route to handle restore logic
router.get("/deleted", transaction_controller_1.getDeletedTransactions);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map