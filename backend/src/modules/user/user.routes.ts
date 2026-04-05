import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "./user.controller";

const router: Router = Router();

/*
POST   /api/users                      → Create user (Admin)
GET    /api/users                      → Get all users (Admin)
GET    /api/users/:id                  → Get single user (Admin)
PATCH  /api/users/:id/role             → Change user role (Admin)
PATCH  /api/users/:id/status           → Change user status (Admin)
*/

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.put("/:id/status", updateUserStatus);

export default router;
