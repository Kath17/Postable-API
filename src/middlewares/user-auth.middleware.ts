import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PostableError } from "./error.middleware";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}
const jwtSecret = "ultra-secret";

export const authenticateHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (!token)
    return next(new PostableError("No autorizado", 401, "AuthHandler error"));
  try {
    const payload = jwt.verify(token, jwtSecret) as {
      userId: number;
      userRole: string;
      iat: number;
      exp: number;
    };
    req.userId = payload.userId;
    req.userRole = payload.userRole;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminAuthorizacion = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.userRole);
    if (req.userRole === "admin") {
      next();
    } else {
      throw new PostableError("Not authorized", 401, "adminAuth error");
    }
  } catch (error) {
    next(error);
  }
};
