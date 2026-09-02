import asyncHandler from "express-async-handler";
import { getAllAdminProductService } from "../../services/products/getAllAdmin.product.service.js";

/**
 * ==========================================================
 * Get All Products (Admin)
 * @route GET /api/v1/products/admin
 * @access Private (Super Admin/Admin)
 * ==========================================================
 */
export const getAllAdminProducts = asyncHandler(async (req, res) => {
  const result = await getAllAdminProductService(req.query);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    data: result.products,
    pagination: result.pagination,
  });
});
