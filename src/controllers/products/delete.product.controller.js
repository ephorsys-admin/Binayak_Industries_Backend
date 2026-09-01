import asyncHandler from "express-async-handler";
import { deleteProductService } from "../../services/products/delete.product.service.js";

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await deleteProductService(
    req.params.productId,
    req.admin._id,
  );

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
    data: product,
  });
});
