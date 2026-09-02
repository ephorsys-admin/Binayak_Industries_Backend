import express from "express";
import rateLimit from "express-rate-limit";
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/orders/order.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

// ==========================================================
// Rate Limiter for Storefront Checkout (Spam / DDoS Prevention)
// ==========================================================
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many orders submitted from this IP. Please try again later or contact our team directly.",
  },
});

// ==========================================================
// Public Storefront Routes
// ==========================================================
router.post("/checkout", checkoutLimiter, createOrder);

// ==========================================================
// Protected Admin Routes
// ==========================================================
router.get("/admin", isAuthenticated, authorizeRoles("super_admin", "admin"), getAllOrders);
router.get("/admin/:id", isAuthenticated, authorizeRoles("super_admin", "admin"), getSingleOrder);
router.patch("/admin/:id/status", isAuthenticated, authorizeRoles("super_admin", "admin"), updateOrderStatus);

export default router;
