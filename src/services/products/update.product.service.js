import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";
import Category from "../../model/category.model.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const updateProductService = async (productId, data, adminId, files = {}) => {
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
  // Validate Category
  // ==========================================================
  if (data.category) {
    const categoryExists = await Category.findOne({
      _id: data.category,
      status: true,
      isDeleted: false,
    });

    if (!categoryExists) {
      throw new ApiError(404, "Category not found.");
    }
  }

  // ==========================================================
  // Duplicate Product Check
  // ==========================================================
  if (data.name) {
    const existingProduct = await Product.findOne({
      _id: { $ne: productId },
      name: data.name.trim(),
      category: data.category || product.category,
      isDeleted: false,
    });

    if (existingProduct) {
      throw new ApiError(409, "Product already exists in this category.");
    }
  }

  // ==========================================================
  // Price Validation
  // ==========================================================
  const mrp = data.mrp !== undefined ? Number(data.mrp) : product.mrp;

  const sellingPrice =
    data.sellingPrice !== undefined
      ? Number(data.sellingPrice)
      : product.sellingPrice;

  if (sellingPrice > mrp) {
    throw new ApiError(400, "Selling price cannot be greater than MRP.");
  }

  // ==========================================================
  // Handle GIF Upload / Removal
  // ==========================================================
  const gifFiles = files && files.gif ? files.gif : [];

  if (gifFiles.length > 0) {
    const uploadedGif = await uploadToCloudinary(
      gifFiles[0].buffer,
      "products/gifs"
    );
    product.gif = {
      url: uploadedGif.secure_url,
      publicId: uploadedGif.public_id,
    };
  } else if (data.removeGif === "true" || data.removeGif === true) {
    product.gif = {
      url: "",
      publicId: "",
    };
  } else if (data.gif && typeof data.gif === "string") {
    product.gif = {
      url: data.gif.trim(),
      publicId: "",
    };
  }

  // ==========================================================
  // Update Product Details
  // ==========================================================
  const ignoredKeys = ["gif", "removeGif", "images"];
  Object.keys(data).forEach((key) => {
    if (!ignoredKeys.includes(key)) {
      product[key] = data[key];
    }
  });

  product.updatedBy = adminId;

  await product.save();

  return product;
};
