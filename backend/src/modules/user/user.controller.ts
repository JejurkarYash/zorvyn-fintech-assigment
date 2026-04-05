import type { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import {
  createUserSchema,
  changeUserRoleSchema,
  changeUserStatusSchema,
} from "../../zod";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
  try {
    const parsedBody = createUserSchema.safeParse(req.body);
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
    const existingUser = await prisma.users.findUnique({
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

    const hashedPassword = await bcrypt.hash(password, 10);
    // creating user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(status && { status }),
      },
    });

    return res.status(201).json({ user: newUser });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while creating the user",
        err,
      },
    });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    // fetching all users from database
    const users = await prisma.users.findMany({});

    if (users.length === 0) {
      return res.status(404).json({
        error: {
          code: "NO_USERS_FOUND",
          message: "No users found in the database",
        },
      });
    }

    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching users",
        err,
      },
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id as string;

    const user = await prisma.users.findUnique({
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
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching the user",
      },
    });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const parsedBody = changeUserRoleSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: "Invalid input data",
          errorDetails: parsedBody.error.message,
        },
      });
    }

    const userId = req.params.id as string;
    const { role } = parsedBody.data;

    // check if user if admin or not
    const user = await prisma.users.findUnique({
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
    const updatedUser = await prisma.users.update({
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
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while updating user role",
        err,
      },
    });
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  try {
    const parsedBody = changeUserStatusSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: "Invalid input data",
          errorDetails: parsedBody.error.message,
        },
      });
    }

    const userId = req.params.id as string;
    const { status } = parsedBody.data;

    // check if user if admin or not
    const user = await prisma.users.findUnique({
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
    const updatedUser = await prisma.users.update({
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
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while updating user status",
        err,
      },
    });
  }
}
