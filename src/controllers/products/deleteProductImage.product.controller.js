import asyncHandler from "express-async-handler";
import { deleteProductImageService } from "../../services/products/deleteProductImage.product.service.js";

export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await deleteProductImageService(
    req.params.productId,
    req.body.publicId,
    req.admin._id,
  );

  return res.status(200).json({
    success: true,
    message: "Product image deleted successfully.",
    data: product,
  });
});
