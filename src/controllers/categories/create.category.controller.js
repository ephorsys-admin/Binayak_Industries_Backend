import asyncHandler from "express-async-handler";
import { createCategoryService } from "../../services/categories/create.category.service.js";

export const createCategory = asyncHandler(async (req, res) => {
    const category = await createCategoryService(
        req.body,
        req.file,
        req.admin._id,
    );

    return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category,
    });
});
