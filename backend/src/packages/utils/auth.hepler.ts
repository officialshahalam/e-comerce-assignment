import crypto from "crypto";

import redis from "configs/radis";
import { NextFunction, Request, Response } from "express";
import prisma from "configs/prisma";
import { ValidationError } from "packages/error-handler";
import { sendEmail } from "./sendMail";

export const setCookie = (name: string, value: string, res: Response) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const validateRegistrationData = ({
  name,
  email,
  phone_number,
  country,
  userType,
}: {
  name: string;
  email: string;
  phone_number?: number;
  country?: string;
  userType: "user" | "seller";
}) => {
  if (
    !name ||
    !email ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required fields!`);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email formate`);
  }
};

export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      "Account is lock due to multiple failed attempts ! try after 30 minutes"
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError("Too many otp request! Please try after 1 hour");
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError(
      "Please wait 1 minuts before requesting the new otp"
    );
  }
};

export const traceOtpRequests = async (email: string, next: NextFunction) => {
  let otpRequests = parseInt(
    (await redis.get(`otp_request_count:${email}`)) || "0"
  );
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    throw new ValidationError("Too Many OTP request! please wait 1 hour");
  }
  await redis.set(`otp_request_count:${email}`, otpRequests + 1, "EX", 3600);
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError("Invalid or Expired OTP");
  }
  const failedAttempt = parseInt(
    (await redis.get(`otp_attempts:${email}`)) || "0"
  );

  if (storedOtp !== otp) {
    if (failedAttempt >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, `otp_attempts:${email}`);
      throw new ValidationError(
        "Too many Failed Attempts, your accounts is locked for 30 mints"
      );
    }
    await redis.set(`otp_attempts:${email}`, failedAttempt + 1, "EX", 300);
    throw new ValidationError(
      `Incorrect OTP. ${2 - failedAttempt} attempts left.`
    );
  }
  await redis.del(`otp:${email}`, `otp_attempts:${email}`);
};

export const verifyForgotPasswordOtp = async (
  email: string,
  otp: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!email || !otp) {
      throw new ValidationError("Email ans OTP are required!");
    }
    await verifyOtp(email, otp, next);
    res.status(200).json({
      message: "OTP verified ! You can reset your password",
    });
  } catch (error) {
    next(error);
  }
};


