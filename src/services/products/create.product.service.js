import Category from "../../model/category.model.js";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const createProductService = async (data, files, adminId) => {
  const {
    name,
    category,
    shortDescription,
    description,
    mrp,
    sellingPrice,
    stock,
    unit,
    weight,
    weightUnit,
    shelfLife,
    status,
    isAvailable,
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    homeDelivery,
    allowInquiry,
  } = data;

  // ==========================================================
  // Validate Category
  // ==========================================================

  const categoryExists = await Category.findOne({
    _id: category,
    status: true,
    isDeleted: false,
  });

  if (!categoryExists) {
    throw new ApiError(404, "Category not found.");
  }

  // ==========================================================
  // Duplicate Product
  // ==========================================================

  const existingProduct = await Product.findOne({
    name: name.trim(),
    category,
  });

  if (existingProduct) {
    throw new ApiError(409, "Product already exists in this category.");
  }

  // ==========================================================
  // Price Validation
  // ==========================================================

  if (Number(sellingPrice) > Number(mrp)) {
    throw new ApiError(400, "Selling price cannot be greater than MRP.");
  }

  // ==========================================================
  // Images Validation
  // ==========================================================

  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one product image is required.");
  }

  if (files.length > 5) {
    throw new ApiError(400, "Maximum 5 images are allowed.");
  }

  // ==========================================================
  // Upload Images
  // ==========================================================

  const images = [];

  for (let i = 0; i < files.length; i++) {
    const uploaded = await uploadToCloudinary(files[i].buffer, "products");

    images.push({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      isPrimary: i === 0,
    });
  }

  // ==========================================================
  // Create Product
  // ==========================================================

  const product = await Product.create({
    name,
    category,
    shortDescription,
    description,
    images,
    mrp,
    sellingPrice,
    stock,
    unit,
    weight,
    weightUnit,
    shelfLife,
    status,
    isAvailable,
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    homeDelivery,
    allowInquiry,
    createdBy: adminId,
  });

  return product;
};
