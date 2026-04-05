import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// extending express request to include user info from token
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    } 
  }
}

export async function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = {
      userId: (decoded as any).userId,
      role: (decoded as any).role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
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
