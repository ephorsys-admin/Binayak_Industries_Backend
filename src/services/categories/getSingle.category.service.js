import mongoose from "mongoose";
import Category from "../../model/category.model.js";
import ApiError from "../../utils/ApiError.js";


/**
 * ==========================================================
 * Get Single Category (Public)
 * ==========================================================
 */
export const getSingleCategoryService = async (categoryId) => {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID.");
    }

    // Find Active Category
    const category = await Category.findOne({
        _id: categoryId,
        status: true,
        isDeleted: false,
    }).select("-createdBy -updatedBy -isDeleted");

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    return category;
};
