import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const addProductImagesService = async (productId, files, adminId) => {
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
  // Validate Images
  // ==========================================================
  if (!files || files.length === 0) {
    throw new ApiError(400, "Please upload at least one image.");
  }

  if (product.images.length + files.length > 5) {
    throw new ApiError(400, "Maximum 5 images are allowed.");
  }

  // ==========================================================
  // Upload Images
  // ==========================================================
  for (const file of files) {
    const uploaded = await uploadToCloudinary(file.buffer, "products");

    product.images.push({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      isPrimary: false,
    });
  }

  // First image should be primary
  if (product.images.length === files.length) {
    product.images[0].isPrimary = true;
  }

  product.updatedBy = adminId;

  await product.save();

  return product;
};
