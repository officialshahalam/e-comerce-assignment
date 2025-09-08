import type { NextFunction, Request, Response } from "express";

import bcrypt from "bcryptjs";

import {
  verifyOtp,
  sendOtp,
  setCookie,
  traceOtpRequests,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  checkOtpRestrictions,
} from "../packages/utils/auth.hepler";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { AuthError, ValidationError } from "../packages/error-handler";
import {} from "../packages/utils/auth.hepler";
import prisma from "../configs/prisma";
import { Prisma } from "@prisma/client";

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
      include: {
        avatar: {
          select: {
            file_id: true,
            url: true,
          },
        },
      },
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
        avatar: user.avatar,
        role: user.role,
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

export const logoutUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // important so middleware can't see it anymore
    });

    return res.json({ success: true, message: "Logged out successfully" });
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

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.siteConfig.findFirst();
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Categories not founds",
      });
    }
    res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      images = [],
      sale_price,
      regular_price,
      colors = [],
      sizes = [],
      stock,
      warranty,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !subCategory ||
      !images ||
      !sale_price ||
      !regular_price ||
      !colors ||
      !sizes ||
      !stock
    ) {
      return next(new ValidationError("Missing Required Fields"));
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        category,
        subCategory,
        images: {
          create: images
            .filter((img: any) => img && img.fileId && img.file_url)
            .map((image: any) => ({
              file_id: image.fileId,
              url: image.file_url,
            })),
        },
        colors: colors || [],
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        warranty,
        starting_date: null,
        ending_date: null,
      },
      include: { images: true },
    });

    res.status(201).json({
      success: true,
      newProduct,
      message: "Product is created successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const baseFilter = {};

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      type === "latest"
        ? { createdAt: "desc" as Prisma.SortOrder }
        : { ratings: "desc" as Prisma.SortOrder };

    const [products, total, top10Products] = await Promise.all([
      prisma.product.findMany({
        where: baseFilter,
        orderBy: {
          ratings: "desc",
        },
        take: limit,
        skip,
        include: {
          images: true,
        },
      }),
      prisma.product.count({ where: baseFilter }),
      prisma.product.findMany({
        where: baseFilter,
        orderBy,
        take: 10,
      }),
    ]);

    res.status(200).json({
      products,
      top10By: type === "latest" ? "latest" : "top rating",
      top10Products,
      total,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getFilteredProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      priceRange = [0, 1000],
      categories = [],
      colors = [],
      sizes = [],
      page = 1,
      limit = 12,
    } = req.query;
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const parsedPriceRange =
      typeof priceRange === "string"
        ? priceRange.split(",").map(Number)
        : [0, 1000];

    const filters: Record<string, any> = {
      sale_price: {
        gte: parsedPriceRange[0],
        lte: parsedPriceRange[1],
      },
    };
    if (categories && (categories as string[]).length > 0) {
      filters.category = {
        in: Array.isArray(categories)
          ? categories
          : String(categories).split(","),
      };
    }

    if (colors && (colors as string[]).length > 0) {
      filters.colors = {
        hasSome: Array.isArray(colors) ? colors : String(colors).split(","),
      };
    }

    if (sizes && (sizes as string[]).length > 0) {
      filters.sizes = {
        hasSome: Array.isArray(sizes) ? sizes : String(sizes).split(","),
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
        },
      }),
      prisma.product.count({ where: filters }),
    ]);

    const totalPage = Math.ceil(total / parsedLimit);
    res.status(200).json({
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPage,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const baseFilter = {
      NOT: {
        starting_date: null,
      },
    };

    const [events, total] = await Promise.all([
      prisma.product.findMany({
        where: baseFilter,
        take: limit,
        skip,
        include: {
          images: true,
        },
      }),
      prisma.product.count({ where: baseFilter }),
    ]);

    res.status(200).json({
      events,
      total,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    return next(error);
  }
};

export const getFilteredOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      priceRange = [0, 1000],
      categories = [],
      colors = [],
      sizes = [],
      page = 1,
      limit = 12,
    } = req.query;
    const parsedPriceRange =
      typeof priceRange === "string"
        ? priceRange.split(",").map(Number)
        : [0, 1000];
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const skip = (parsedPage - 1) * parsedLimit;

    const filters: Record<string, any> = {
      sale_price: {
        gte: parsedPriceRange[0],
        lte: parsedPriceRange[1],
      },
      NOT: {
        starting_date: null,
      },
    };
    if (categories && (categories as string[]).length > 0) {
      filters.category = {
        in: Array.isArray(categories)
          ? categories
          : String(categories).split(","),
      };
    }
    if (colors && (colors as string[]).length > 0) {
      filters.colors = {
        hasSome: Array.isArray(colors) ? colors : [String(colors)],
      };
    }

    if (sizes && (sizes as string[]).length > 0) {
      filters.sizes = {
        hasSome: Array.isArray(sizes) ? sizes : [String(sizes)],
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
        },
      }),
      prisma.product.count({ where: filters }),
    ]);
    const totalPage = Math.ceil(total / parsedLimit);
    res.status(200).json({
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPage,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      select: {
        id: true,
        isDeleted: true,
      },
      where: {
        id: productId,
      },
    });
    if (!product) {
      return next(new ValidationError("Product not found"));
    }
    if (product.isDeleted) {
      return next(new ValidationError("product already deleted"));
    }
    const deletedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return res.status(200).json({
      message:
        "Product is Scheduled for deletion in 24 hours. You can restore it within this time",
      deletedAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      select: {
        id: true,
        isDeleted: true,
      },
      where: {
        id: productId,
      },
    });
    if (!product) {
      return next(new ValidationError("Product not found"));
    }
    if (!product.isDeleted) {
      return next(new ValidationError("product is not in deleted state"));
    }
    await prisma.product.update({
      where: { id: productId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return res.status(200).json({
      message: "Product is restored successfully",
    });
  } catch (error) {
    return next(error);
  }
};
