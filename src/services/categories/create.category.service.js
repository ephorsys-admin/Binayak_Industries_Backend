
import Category from "../../model/category.model.js";
import ApiError from "../../utils/ApiError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

export const createCategoryService = async (data, file, adminId) => {
    const { name, description, sortOrder, status } = data;

    const existingCategory = await Category.findOne({
        name: name.trim(),
    });

    if (existingCategory) {
        throw new ApiError(409, "Category already exists.");
    }

    let image = {
        url: "",
        publicId: "",
    };

    if (file) {
        const uploadedImage = await uploadToCloudinary(file.buffer, "categories");

        image = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };
    }

    const category = await Category.create({
        name,
        description,
        sortOrder,
        status,
        image,
        createdBy: adminId,
    });

    if (!category) {
        throw new ApiError(500, "Failed to create category.");
    }

    return category;
};
