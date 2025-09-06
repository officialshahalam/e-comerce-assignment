import type { NextFunction, Response } from "express";
import { AuthError } from "../error-handler/index";

export const isUser = (req: any, _res: Response, next: NextFunction) => {
  if (req.role !== "user") {
    return next(new AuthError("Access denied: User only"));
  }
  next();
};

export const isAdmin = (req: any, _res: Response, next: NextFunction) => {
  if (req.role !== "admin") {
    return next(new AuthError("Access denied: Admin only"));
  }
  next();
};
