import Product from "../../model/product.model.js";


/**
 * ==========================================================
 * Get All Products (Admin)
 * ==========================================================
 */
export const getAllAdminProductService = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    category,
    status,
    isAvailable,
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
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

  // Category
  if (category) {
    filter.category = category;
  }

  // Status
  if (status !== undefined) {
    filter.status = status === "true";
  }

  // Availability
  if (isAvailable !== undefined) {
    filter.isAvailable = isAvailable === "true";
  }

  // Featured
  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured === "true";
  }

  // Trending
  if (isTrending !== undefined) {
    filter.isTrending = isTrending === "true";
  }

  // Best Seller
  if (isBestSeller !== undefined) {
    filter.isBestSeller = isBestSeller === "true";
  }

  // New Arrival
  if (isNewArrival !== undefined) {
    filter.isNewArrival = isNewArrival === "true";
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort({
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    products,
    pagination: {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
    },
  };
};
