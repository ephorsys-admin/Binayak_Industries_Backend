import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import upload from "../middlewares/upload.middleware.js";


// Controllers
import { createProduct } from "../controllers/products/create.product.controller.js";
import { getAllProducts } from "../controllers/products/getAll.product.controller.js";
import { getAllAdminProducts } from "../controllers/products/getAllAdmin.product.controller.js";
import { getSingleProduct } from "../controllers/products/getSingle.product.controller.js";
import { getSingleAdminProduct } from "../controllers/products/getSingleAdmin.product.controller.js";
import { updateProduct } from "../controllers/products/update.product.controller.js";
import { addProductImages } from "../controllers/products/addProductImages.product.controller.js";
import { deleteProductImage } from "../controllers/products/deleteProductImage.product.controller.js";
import { deleteProduct } from "../controllers/products/delete.product.controller.js";

const ProductRouter = express.Router();

// ==========================================================
// Admin Create Product
// ==========================================================

ProductRouter.post(
  "/create",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "gif", maxCount: 1 },
  ]),
  createProduct,
);

// ==========================================================
// Public Get All Products
// ==========================================================

ProductRouter.get("/", getAllProducts);

// ==========================================================
// Admin Get All Products
// ==========================================================

ProductRouter.get(
  "/admin",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  getAllAdminProducts,
);

// ==========================================================
// Add Product Images
// ==========================================================

ProductRouter.post(
  "/:productId/images",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  upload.array("images", 5),
  addProductImages,
);

// ==========================================================
// Update Product Details
// ==========================================================

ProductRouter.put(
  "/update/:productId",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "gif", maxCount: 1 },
  ]),
  updateProduct,
);

// ==========================================================
// Get Single Product (Admin)
// ==========================================================

ProductRouter.get(
  "/admin/:productId",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  getSingleAdminProduct,
);

// ==========================================================
// Get Single Product (Public)
// ==========================================================

ProductRouter.get(
  "/:productId",
  getSingleProduct,
);

// ==========================================================
// Delete Product Image
// ==========================================================

ProductRouter.delete(
  "/:productId/images",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  deleteProductImage,
);

// ==========================================================
// Delete Product (Soft Delete)
// ==========================================================

ProductRouter.delete(
  "/delete/:productId",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  deleteProduct,
);

export default ProductRouter;
