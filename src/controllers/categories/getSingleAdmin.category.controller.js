import asyncHandler from "express-async-handler";
import { getSingleAdminCategoryService } from "../../services/categories/getSingleAdmin.category.service.js";

/**
 * ==========================================================
 * Get Single Category (Admin)
 * @route GET /api/v1/categories/admin/:categoryId
 * @access Private
 * ==========================================================
 */
export const getSingleAdminCategory = asyncHandler(async (req, res) => {
    const category = await getSingleAdminCategoryService(req.params.categoryId);

    return res.status(200).json({
        success: true,
        message: "Category fetched successfully.",
        data: category,
    });
});
