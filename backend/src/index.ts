import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/user/user.routes";
import { jwtMiddleware } from "./middlewares/jwt.middleware";
import { roleMiddleware } from "./middlewares/role.middleware";
import transactionRoutes from "./modules/transactions/transaction.routes";
import transactoinsRoutesPublic from "./modules/transactions/transaction.routes.public";
import dashboardRoutes from "./modules/dashboard/dashbaord.routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
// auth routes  -  public route
app.use("/api/auth", authRoutes);

// protected routes
// user routes - only accessible by admin
app.use("/api/users", jwtMiddleware, roleMiddleware(["ADMIN"]), userRoutes);

// Transaction routes - only accessible by admin
app.use(
  "/api/transactions",
  jwtMiddleware,
  roleMiddleware(["ADMIN"]),
  transactionRoutes,
);

// Transaction routes - accessible by all authenticated users
app.use("/api/transactions/public", jwtMiddleware, transactoinsRoutesPublic);

// Dashboard routes - accessible by all authenticated users
app.use(
  "/api/dashboard",
  jwtMiddleware,
  roleMiddleware(["ADMIN", "ANALYST"]),
  dashboardRoutes,
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
