"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
/*
POST   /api/users                      → Create user (Admin)
GET    /api/users                      → Get all users (Admin)
GET    /api/users/:id                  → Get single user (Admin)
PATCH  /api/users/:id/role             → Change user role (Admin)
PATCH  /api/users/:id/status           → Change user status (Admin)
*/
router.post("/", user_controller_1.createUser);
router.get("/", user_controller_1.getAllUsers);
router.get("/:id", user_controller_1.getUserById);
router.put("/:id/role", user_controller_1.updateUserRole);
router.put("/:id/status", user_controller_1.updateUserStatus);
exports.default = router;
//# sourceMappingURL=user.routes.js.map