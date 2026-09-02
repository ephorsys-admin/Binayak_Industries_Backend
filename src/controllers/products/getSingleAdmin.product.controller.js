import asyncHandler from "express-async-handler";
import { getSingleAdminProductService } from "../../services/products/getSingleAdmin.product.service.js";

/**
 * ==========================================================
 * Get Single Product (Admin)
 * ==========================================================
 */
export const getSingleAdminProduct = asyncHandler(async (req, res) => {
  const product = await getSingleAdminProductService(req.params.productId);

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    data: product,
  });
});
