import asyncHandler from "express-async-handler";
import { getSingleProductService } from "../../services/products/getSingle.product.service.js";

/**
 * ==========================================================
 * Get Single Product (Public)
 * ==========================================================
 */
export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await getSingleProductService(req.params.productId);

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    data: product,
  });
});
