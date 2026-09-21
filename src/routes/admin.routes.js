import express from "express";
import registerAdminController from "../controllers/admin/register.admin.controller.js";
import loginAdminController from "../controllers/admin/login.admin.controller.js";
import refreshTokenController from "../controllers/admin/refreshToken.controller.js";
import forgotPasswordController from "../controllers/admin/forgot.password.controller.js";
import verifyForgotOtpController from "../controllers/admin/verify.forgot.otp.controller.js";
import resetPasswordController from "../controllers/admin/reset.password.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import logoutAdminController from "../controllers/admin/logout.admin.controller.js";
import getAdminDashboardController from "../controllers/admin/dashboard.admin.controller.js";


const adminRoutes = express.Router();

//test

// ======================================
// ADMIN REGISTER
// ======================================

adminRoutes.post("/register", registerAdminController);
// ======================================
// ADMIN LOGIN
// ======================================
adminRoutes.post("/login", loginAdminController);

// ======================================
// ADMIN REFRESH TOKEN
// ======================================
adminRoutes.post("/refresh-token", refreshTokenController);

// ======================================
// ADMIN DASHBOARD STATS (PROTECTED)
// ======================================
adminRoutes.get(
    "/dashboard",
    isAuthenticated,
    authorizeRoles("super_admin", "admin"),
    getAdminDashboardController
);

// ======================================
// ADMIN PROFILE (PROTECTED TEST ROUTE)
// ======================================
adminRoutes.get("/profile", isAuthenticated, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        admin: {
            id: req.admin._id,
            name: req.admin.name,
            email: req.admin.email,
            role: req.admin.role,
        },
    });
});

adminRoutes.post("/forgot-password", forgotPasswordController);
adminRoutes.post("/verify-forgot-otp", verifyForgotOtpController);
adminRoutes.post("/reset-password", resetPasswordController);

// ======================================
// ADMIN LOGOUT
// ======================================

adminRoutes.post("/logout", isAuthenticated, logoutAdminController);

export default adminRoutes;
