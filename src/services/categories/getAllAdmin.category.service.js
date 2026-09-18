import Category from "../../model/category.model.js";

/**
 * ==========================================================
 * Get All Categories (Admin)
 * ==========================================================
 */
export const getAllAdminCategoryService = async (query) => {
    let {
        page = 1,
        limit = 10,
        search = "",
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    page = Number(page);
    limit = Number(limit);

    const filter = {
        isDeleted: false,
    };

    // Search
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    // Status Filter
    if (status !== undefined) {
        filter.status = status === "true";
    }

    const totalCategories = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        categories,
        pagination: {
            totalCategories,
            totalPages: Math.ceil(totalCategories / limit),
            currentPage: page,
            limit,
        },
    };
};
