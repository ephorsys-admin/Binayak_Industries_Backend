import asyncHandler from "express-async-handler";
import { updateCategoryService } from "../../services/categories/update.category.service.js";

/**
 * ==========================================================
 * Update Category Controller
 * @route PUT /api/v1/categories/update/:categoryId
 * @access Private (Super Admin/Admin)
 * ==========================================================
 */
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await updateCategoryService(
        req.params.categoryId,
        req.body,
        req.file,
        req.admin._id,
    );

    return res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: category,
    });
});
