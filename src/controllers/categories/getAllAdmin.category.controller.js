import asyncHandler from "express-async-handler";
import { getAllAdminCategoryService } from "../../services/categories/getAllAdmin.category.service.js";

/**
 * ==========================================================
 * Get All Categories (Admin)
 * @route GET /api/v1/categories/admin
 * @access Private
 * ==========================================================
 */
export const getAllAdminCategories = asyncHandler(async (req, res) => {
    const result = await getAllAdminCategoryService(req.query);

    return res.status(200).json({
        success: true,
        message: "Categories fetched successfully.",
        data: result.categories,
        pagination: result.pagination,
    });
});
