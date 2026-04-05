import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginSchema } from "../../zod/index";
import { prisma } from "../../db/prisma";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  try {
    const parsedBody = loginSchema.safeParse(req.body);

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

    const user = await prisma.users.findUnique({
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid credentials",
        },
      });
    }

    // signing token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        errorDetails: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
