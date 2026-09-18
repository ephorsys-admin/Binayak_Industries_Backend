import asyncHandler from "express-async-handler";
import { getAllCategoryService } from "../../services/categories/getAll.category.service.js";

/**
 * ==========================================================
 * Get All Categories (Public)
 * @route GET /api/v1/categories
 * @access Public
 * ==========================================================
 */
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await getAllCategoryService(req.query);

    return res.status(200).json({
        success: true,
        message: "Categories fetched successfully.",
        total: categories.length,
        data: categories,
    });
});
