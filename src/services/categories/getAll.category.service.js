import Category from "../../model/category.model.js";

/**
 * ==========================================================
 * Get All Categories (Public)
 * ==========================================================
 */
export const getAllCategoryService = async () => {
    const categories = await Category.find({
        status: true,
        isDeleted: false,
    })
        .sort({ sortOrder: 1, createdAt: -1 })
        .select("-createdBy -updatedBy -isDeleted");

    return categories;
};
