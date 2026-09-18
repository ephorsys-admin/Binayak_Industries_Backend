import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";

export const deleteProductService = async (productId, adminId) => {
  // ==========================================================
  // Validate Product ID
  // ==========================================================

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID.");
  }

  // ==========================================================
  // Find Product
  // ==========================================================

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
  });

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // ==========================================================
  // Soft Delete
  // ==========================================================

  product.isDeleted = true;
  product.status = false;
  product.updatedBy = adminId;

  await product.save();

  return product;
};
