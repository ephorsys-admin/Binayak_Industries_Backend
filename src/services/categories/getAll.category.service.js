import Category from "../../model/category.model.js";

/**
 * ==========================================================
 * Get All Categories (Public with Search)
 * ==========================================================
 */
export const getAllCategoryService = async (query = {}) => {
    const { search = "", limit = 50 } = query;

    const filter = {
        status: true,
        isDeleted: false,
    };

    if (search && search.trim()) {
        filter.name = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    const categories = await Category.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(Number(limit) || 50)
        .select("-createdBy -updatedBy -isDeleted");

    return categories;
};
