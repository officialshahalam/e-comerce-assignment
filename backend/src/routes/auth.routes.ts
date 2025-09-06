import express, { Router } from "express";
import {
  getUser,
  loginUser,
  resetUserPassword,
  userForgotPassword,
  userRegistration,
  verifyUser,
  verifyUserForgotPassword,
} from "../controllers/auth.controller";
import isAuthenticated from "packages/middleware/isAuthenticated";
import { isUser } from "packages/middleware/authorizeRoles";

const router: Router = express.Router();

router.post("/registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.get("/logged-in-user", isAuthenticated, isUser, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);
router.post("/reset-password-user", resetUserPassword);

export default router;
