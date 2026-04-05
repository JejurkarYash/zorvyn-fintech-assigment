"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;
            if (!userRole) {
                return res.status(401).json({
                    error: {
                        code: "ROLE_MISSING",
                        message: "User role is missing in token",
                    },
                });
            }
            if (!requiredRole.includes(userRole)) {
                return res.status(403).json({
                    error: {
                        code: "FORBIDDEN",
                        message: "You are not authorized to access this resource",
                    },
                });
            }
            //   calling next function
            next();
        }
        catch (err) {
            return res.status(500).json({
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected error occurred",
                    err,
                },
            });
        }
    };
}
//# sourceMappingURL=role.middleware.js.map