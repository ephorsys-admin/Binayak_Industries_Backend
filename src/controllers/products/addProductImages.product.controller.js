import asyncHandler from "express-async-handler";
import { addProductImagesService } from "../../services/products/addProductImages.product.service.js";

export const addProductImages = asyncHandler(async (req, res) => {
  const product = await addProductImagesService(
    req.params.productId,
    req.files,
    req.admin._id,
  );

  return res.status(200).json({
    success: true,
    message: "Product images added successfully.",
    data: product,
  });
});
