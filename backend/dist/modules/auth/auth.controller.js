"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../../zod/index");
const prisma_1 = require("../../db/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function login(req, res) {
    try {
        const parsedBody = index_1.loginSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid input data",
                    errorDetails: parsedBody.error.message,
                },
            });
        }
        const { email, password } = parsedBody.data;
        const user = await prisma_1.prisma.users.findUnique({
            where: {
                email,
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
        // checking if user is active or not
        if (user.status === "INACTIVE") {
            return res.status(403).json({
                error: {
                    code: "USER_INACTIVE",
                    message: "User account is inactive",
                },
            });
        }
        // comparing password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid credentials",
                },
            });
        }
        // signing token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            token,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred",
                errorDetails: err instanceof Error ? err.message : String(err),
            },
        });
    }
}
//# sourceMappingURL=auth.controller.js.map