import asyncHandler from "express-async-handler";
import { updateProductService } from "../../services/products/update.product.service.js";

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(
    req.params.productId,
    req.body,
    req.admin._id,
  );

  return res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});