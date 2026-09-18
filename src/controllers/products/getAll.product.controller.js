import asyncHandler from "express-async-handler";
import { getAllProductService } from "../../services/products/getAll.product.service.js";

/**
 * ==========================================================
 * Get All Products (Public)
 * ==========================================================
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const result = await getAllProductService(req.query);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    data: result.products,
    pagination: result.pagination,
  });
});
