import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";

/**
 * ==========================================================
 * Get Single Product (Public)
 * ==========================================================
 */
export const getSingleProductService = async (productId) => {
  // Validate Product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID.");
  }

  // Find Product
  const product = await Product.findOne({
    _id: productId,
    status: true,
    isAvailable: true,
    isDeleted: false,
  })
    .populate("category", "name slug")
    .select("-createdBy -updatedBy -isDeleted");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product;
};
