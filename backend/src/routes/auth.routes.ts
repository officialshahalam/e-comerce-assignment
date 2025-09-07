import express, { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllOffers,
  getAllProduct,
  getCategories,
  getFilteredOffers,
  getFilteredProducts,
  getUser,
  loginUser,
  logoutUser,
  resetUserPassword,
  restoreProduct,
  userForgotPassword,
  userRegistration,
  verifyUser,
  verifyUserForgotPassword,
} from "../controllers/auth.controller";
import isAuthenticated from "../packages/middleware/isAuthenticated";
import { isUser } from "../packages/middleware/authorizeRoles";

const router: Router = express.Router();

//auth
router.post("/registration-user", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.get("/logged-in-user", isAuthenticated, isUser, getUser);
router.post("/logout-user",logoutUser)
router.post("/forgot-password-user", userForgotPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);
router.post("/reset-password-user", resetUserPassword);

//product
router.get("/get-categories", getCategories);
router.post("/create-product", isAuthenticated, createProduct);
router.get("/get-all-products", getAllProduct);
router.get("/get-filtered-products", getFilteredProducts);
router.get("/get-all-offers", getAllOffers);
router.get("/get-filtered-offers", getFilteredOffers);
router.delete("/delete-product/:productId", isAuthenticated, deleteProduct);
router.put("/restore-product/:productId", isAuthenticated, restoreProduct);

export default router;
