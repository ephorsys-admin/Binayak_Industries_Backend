import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";

/**
 * ==========================================================
 * Get Single Product (Admin)
 * ==========================================================
 */
export const getSingleAdminProductService = async (productId) => {
  // Validate Product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID.");
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
  })
    .populate("category", "name slug")
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product;
};
