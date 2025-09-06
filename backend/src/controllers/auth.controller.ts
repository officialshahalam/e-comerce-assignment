import type { NextFunction, Request, Response } from "express";
import { AuthError, ValidationError } from "../packages/error-handler/index";
import bcrypt from "bcryptjs";
import prisma from "configs/prisma";
import {
  checkOtpRestrictions,
  sendOtp,
  setCookie,
  traceOtpRequests,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "packages/utils/auth.hepler";
import { randomUUID } from "crypto";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;
    validateRegistrationData({ name, email, userType: "user" });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("User already exist with this email"));
    }
    await checkOtpRestrictions(email);
    await traceOtpRequests(email, next);
    await sendOtp(name, email, "user-activation-mail");
    return res.status(200).json({
      message: "OTP sent to email ! please Verify your account",
    });
  } catch (e) {
    return next(e);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) {
      return next(new ValidationError("All field are required!"));
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError("User already exist with this email"));
    }
    await verifyOtp(email, otp, next);
    const hashPassword = await bcrypt.hash(password, 10);
    const avatar = {
      file_id: randomUUID(),
      url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name
      )}`,
    };

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        avatar: {
          create: avatar,
        },
      },
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (e) {
    return next(e);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("email and passward are required"));
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(
        new AuthError("User does'not Exist !Please register first then login")
      );
    }

    const ismatch = await bcrypt.compare(password, user.password!);
    if (!ismatch) {
      return next(new AuthError("Invalid email or password"));
    }

    const accessToken = await jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // store the access and referesh token in httpOnly secure cookie
    setCookie("access_token", accessToken, res);

    res.status(200).json({
      success: true,
      message: "User LogedIn Successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new ValidationError("Email is required");
    }
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new ValidationError(`user not found`);
    }

    await checkOtpRestrictions(email);
    await traceOtpRequests(email, next);
    await sendOtp(user.name, email, "forgot-password-user-mail");
    res.status(200).json({
      message: "OTP sent to email. Please verify your account",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    await verifyForgotPasswordOtp(email, otp, req, res, next);
  } catch (error) {
    return next(error);
  }
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("Email and New Passwor dare required"));
    }
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return next(new ValidationError("User not Found!"));
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(
        new ValidationError(
          "new password can not be the same as the old password"
        )
      );
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashPassword },
    });
    return res.status(200).json({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {
    next(error);
  }
};
