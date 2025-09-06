import type { NextFunction, Response } from "express";
import { ValidationError } from "../packages/error-handler/index";

export const userRegistration = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return next(new ValidationError("name and email is required"));
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
