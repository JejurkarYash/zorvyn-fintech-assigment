"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUserRole = updateUserRole;
exports.updateUserStatus = updateUserStatus;
const prisma_1 = require("../../db/prisma");
const zod_1 = require("../../zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function createUser(req, res) {
    try {
        const parsedBody = zod_1.createUserSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid input data",
                    errorDetails: parsedBody.error.message,
                },
            });
        }
        const { name, email, password, role, status } = parsedBody.data;
        // Check if user with the same email already exists
        const existingUser = await prisma_1.prisma.users.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(409).json({
                error: {
                    code: "USER_ALREADY_EXISTS",
                    message: "A user with this email already exists",
                },
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // creating user
        const newUser = await prisma_1.prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                ...(status && { status }),
            },
        });
        return res.status(201).json({ user: newUser });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the user",
                err,
            },
        });
    }
}
async function getAllUsers(req, res) {
    try {
        // fetching all users from database
        const users = await prisma_1.prisma.users.findMany({});
        if (users.length === 0) {
            return res.status(404).json({
                error: {
                    code: "NO_USERS_FOUND",
                    message: "No users found in the database",
                },
            });
        }
        return res.status(200).json({ users });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching users",
                err,
            },
        });
    }
}
async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const user = await prisma_1.prisma.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the user",
            },
        });
    }
}
async function updateUserRole(req, res) {
    try {
        const parsedBody = zod_1.changeUserRoleSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid input data",
                    errorDetails: parsedBody.error.message,
                },
            });
        }
        const userId = req.params.id;
        const { role } = parsedBody.data;
        // check if user if admin or not
        const user = await prisma_1.prisma.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (user?.role === "ADMIN") {
            return res.status(403).json({
                error: {
                    code: "FORBIDDEN",
                    message: "Cannot change role of an admin user",
                },
            });
        }
        // updating user role in database
        const updatedUser = await prisma_1.prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                role,
            },
        });
        return res.status(200).json({
            message: "User role updated successfully",
            user: updatedUser,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating user role",
                err,
            },
        });
    }
}
async function updateUserStatus(req, res) {
    try {
        const parsedBody = zod_1.changeUserStatusSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid input data",
                    errorDetails: parsedBody.error.message,
                },
            });
        }
        const userId = req.params.id;
        const { status } = parsedBody.data;
        // check if user if admin or not
        const user = await prisma_1.prisma.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (user?.role === "ADMIN") {
            return res.status(403).json({
                error: {
                    code: "FORBIDDEN",
                    message: "Cannot change status of an admin user",
                },
            });
        }
        // updating user status in database
        const updatedUser = await prisma_1.prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                status,
            },
        });
        return res.status(200).json({
            message: "User status updated successfully",
            user: updatedUser,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating user status",
                err,
            },
        });
    }
}
//# sourceMappingURL=user.controller.js.map