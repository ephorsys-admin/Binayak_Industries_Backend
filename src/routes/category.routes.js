import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import upload from "../middlewares/upload.middleware.js";
import { createCategory } from "../controllers/categories/create.category.controller.js";
import { getAllCategories } from "../controllers/categories/getAll.category.controller.js";
import { getAllAdminCategories } from "../controllers/categories/getAllAdmin.category.controller.js";
import { getSingleCategory } from "../controllers/categories/getSingle.category.controller.js";
import { getSingleAdminCategory } from "../controllers/categories/getSingleAdmin.category.controller.js";
import { updateCategory } from "../controllers/categories/update.category.controller.js";

const CategoryRouter = express.Router();


// Get All Categories (Website / Mobile)
CategoryRouter.get("/", getAllCategories);
// Create Category
CategoryRouter.post(
    "/create",
    isAuthenticated,
    authorizeRoles("super_admin", "admin"),
    upload.single("image"),
    createCategory,
);

// Get All Categories (Admin Panel)
CategoryRouter.get(
    "/admin",
    isAuthenticated,
    authorizeRoles("super_admin", "admin"),
    getAllAdminCategories,
);
// ==========================================
// Get Single Details Public
// ==========================================
CategoryRouter.get(
    "/:categoryId",
    getSingleCategory,
);


// ==========================================
// Get Single Details Admin
// ==========================================
CategoryRouter.get(
    "/admin/:categoryId",
    isAuthenticated,
    authorizeRoles("super_admin", "admin"),
    getSingleAdminCategory,
);


// Update Category
CategoryRouter.put(
    "/update/:categoryId",
    isAuthenticated,
    authorizeRoles("super_admin", "admin"),
    upload.single("image"),
    updateCategory,
);









export default CategoryRouter;
