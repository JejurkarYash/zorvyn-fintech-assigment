"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const jwt_middleware_1 = require("./middlewares/jwt.middleware");
const role_middleware_1 = require("./middlewares/role.middleware");
const transaction_routes_1 = __importDefault(require("./modules/transactions/transaction.routes"));
const transaction_routes_public_1 = __importDefault(require("./modules/transactions/transaction.routes.public"));
const dashbaord_routes_1 = __importDefault(require("./modules/dashboard/dashbaord.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
// auth routes  -  public route
app.use("/api/auth", auth_route_1.default);
// protected routes
// user routes - only accessible by admin
app.use("/api/users", jwt_middleware_1.jwtMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), user_routes_1.default);
// Transaction routes - only accessible by admin
app.use("/api/transactions", jwt_middleware_1.jwtMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), transaction_routes_1.default);
// Transaction routes - accessible by all authenticated users
app.use("/api/transactions/public", jwt_middleware_1.jwtMiddleware, transaction_routes_public_1.default);
// Dashboard routes - accessible by all authenticated users
app.use("/api/dashboard", jwt_middleware_1.jwtMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN", "ANALYST"]), dashbaord_routes_1.default);
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map