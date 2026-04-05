"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = jwtMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function jwtMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                error: {
                    code: "TOKEN_MISSING",
                    message: "Authorization token is missing",
                },
            });
        }
        // verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                error: {
                    code: "TOKEN_EXPIRED",
                    message: "Authorization token has expired",
                },
            });
        }
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred",
                err,
            },
        });
    }
}
//# sourceMappingURL=jwt.middleware.js.map