import mongoose from "mongoose";
import Category from "../../model/category.model.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

/**
 * ==========================================================
 * Update Category Service
 * ==========================================================
 */
export const updateCategoryService = async (
    categoryId,
    data,
    file,
    adminId,
) => {
    const { name, description, sortOrder, status } = data;

    // Validate Category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid Category ID.");
    }

    // Find Category
    const category = await Category.findOne({
        _id: categoryId,
        isDeleted: false,
    });

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    // Check Duplicate Category Name
    if (name && name.trim() !== category.name) {
        const existingCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: categoryId },
        });

        if (existingCategory) {
            throw new ApiError(409, "Category already exists.");
        }

        category.name = name.trim();
    }

    // Update Image
    if (file) {
        // Delete old image from Cloudinary
        if (category.image?.publicId) {
            await cloudinary.uploader.destroy(category.image.publicId);
        }

        const uploadedImage = await uploadToCloudinary(file.buffer, "categories");

        category.image = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };
    }

    // Update Other Fields
    if (description !== undefined) category.description = description;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (status !== undefined) category.status = status;

    category.updatedBy = adminId;

    await category.save();

    return category;
};
