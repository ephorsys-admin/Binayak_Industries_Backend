import asyncHandler from "express-async-handler";
import { getSingleCategoryService } from "../../services/categories/getSingle.category.service.js";

/**
 * ==========================================================
 * Get Single Category
 * @route GET /api/v1/categories/:categoryId
 * @access Public
 * ==========================================================
 */
export const getSingleCategory = asyncHandler(async (req, res) => {
    const category = await getSingleCategoryService(req.params.categoryId);

    return res.status(200).json({
        success: true,
        message: "Category fetched successfully.",
        data: category,
    });
});
