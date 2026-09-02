import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";


export const deleteProductImageService = async (
  productId,
  publicId,
  adminId,
) => {
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
  // Validate Public ID
  // ==========================================================

  if (!publicId) {
    throw new ApiError(400, "Image publicId is required.");
  }

  // ==========================================================
  // Find Image
  // ==========================================================

  const imageIndex = product.images.findIndex(
    (image) => image.publicId === publicId,
  );

  if (imageIndex === -1) {
    throw new ApiError(404, "Image not found.");
  }

  const deletedImage = product.images[imageIndex];

  // ==========================================================
  // Delete From Cloudinary
  // ==========================================================

  if (deletedImage.publicId) {
    await cloudinary.uploader.destroy(deletedImage.publicId);
  }

  // ==========================================================
  // Remove Image From Database
  // ==========================================================

  product.images.splice(imageIndex, 1);

  // ==========================================================
  // If Primary Image Deleted
  // Make First Image Primary
  // ==========================================================

  if (deletedImage.isPrimary && product.images.length > 0) {
    product.images[0].isPrimary = true;
  }

  product.updatedBy = adminId;

  await product.save();

  return product;
};
