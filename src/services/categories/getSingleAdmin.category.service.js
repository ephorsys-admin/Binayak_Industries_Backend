import mongoose from "mongoose";
import ApiError from "../../utils/ApiError.js";
import Category from "../../model/category.model.js";

/**
 * ==========================================================
 * Get Single Category (Admin)
 * ==========================================================
 */
export const getSingleAdminCategoryService = async (categoryId) => {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Invalid category ID.");
    }

    const category = await Category.findOne({
        _id: categoryId,
        isDeleted: false,
    })
        .populate("createdBy", "name email role")
        .populate("updatedBy", "name email role");

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    return category;
};
