import Product from "../../model/product.model.js";


/**
 * ==========================================================
 * Get All Products (Public)
 * ==========================================================
 */
export const getAllProductService = async (query) => {
  let {
    page = 1,
    limit = 12,
    search = "",
    category,
    featured,
    trending,
    bestSeller,
    newArrival,
    homeDelivery,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = Number(page);
  limit = Number(limit);

  const filter = {
    status: true,
    isAvailable: true,
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

  // Featured
  if (featured === "true") {
    filter.isFeatured = true;
  }

  // Trending
  if (trending === "true") {
    filter.isTrending = true;
  }

  // Best Seller
  if (bestSeller === "true") {
    filter.isBestSeller = true;
  }

  // New Arrival
  if (newArrival === "true") {
    filter.isNewArrival = true;
  }

  // Home Delivery
  if (homeDelivery === "true") {
    filter.homeDelivery = true;
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .select("-createdBy -updatedBy -isDeleted")
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
