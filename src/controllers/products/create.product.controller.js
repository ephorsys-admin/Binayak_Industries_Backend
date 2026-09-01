import asyncHandler from "express-async-handler";
import { createProductService } from "../../services/products/create.product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(
    req.body,
    req.files,
    req.admin._id,
  );

  return res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});
