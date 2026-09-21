import Order from "../../model/order.model.js";
import Product from "../../model/product.model.js";
import Category from "../../model/category.model.js";
import Contact from "../../model/contact.model.js";

/**
 * ==========================================================
 * ADMIN DASHBOARD SERVICE
 * Computes all dashboard statistics, recent orders, and top products in 1 single unified call.
 * ==========================================================
 */
export const getAdminDashboardService = async () => {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - 7);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  // Run all primary queries in parallel for ultra-fast performance
  const [
    revenueAgg,
    thisWeekRevenueAgg,
    lastWeekRevenueAgg,
    totalOrdersCount,
    statusCountsAgg,
    activeProductsCount,
    activeCategoriesCount,
    totalInquiriesCount,
    resolvedInquiriesCount,
    recentOrdersDocs,
    topOrderedProductsAgg,
  ] = await Promise.all([
    // 1. Total Gross Revenue (Non-cancelled orders)
    Order.aggregate([
      { $match: { isDeleted: false, status: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$pricing.grandTotal" } } },
    ]),

    // 2. Revenue This Week
    Order.aggregate([
      {
        $match: {
          isDeleted: false,
          status: { $ne: "Cancelled" },
          createdAt: { $gte: startOfThisWeek },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$pricing.grandTotal" } } },
    ]),

    // 3. Revenue Last Week
    Order.aggregate([
      {
        $match: {
          isDeleted: false,
          status: { $ne: "Cancelled" },
          createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$pricing.grandTotal" } } },
    ]),

    // 4. Total Orders Count
    Order.countDocuments({ isDeleted: false }),

    // 5. Status counts breakdown
    Order.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // 6. Active Products Count
    Product.countDocuments({ isDeleted: false, status: true }),

    // 7. Active Categories Count
    Category.countDocuments({ isDeleted: false, status: true }),

    // 8. Total Inquiries Count
    Contact.countDocuments({ isDeleted: false }),

    // 9. Resolved or Contacted Inquiries Count
    Contact.countDocuments({
      isDeleted: false,
      status: { $in: ["Resolved", "Contacted"] },
    }),

    // 10. Recent 5 Orders
    Order.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // 11. Top Selling Products based on ordered quantities
    Order.aggregate([
      { $match: { isDeleted: false, status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          productId: { $first: "$items.product" },
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          price: { $first: "$items.sellingPrice" },
          image: { $first: "$items.image" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 4 },
    ]),
  ]);

  // Total Gross Revenue
  const totalGrossRevenue = revenueAgg[0]?.totalRevenue || 0;
  const thisWeekRevenue = thisWeekRevenueAgg[0]?.totalRevenue || 0;
  const lastWeekRevenue = lastWeekRevenueAgg[0]?.totalRevenue || 0;

  // Calculate revenue growth change
  let revenueChangeText = "+0.0% this week";
  if (lastWeekRevenue > 0) {
    const diff = ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;
    revenueChangeText = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}% this week`;
  } else if (thisWeekRevenue > 0) {
    revenueChangeText = "+100% this week";
  }

  // Parse status counts
  const statusMap = {
    "Kitchen Preparing": 0,
    "In Transit": 0,
    "Delivered": 0,
    "Cancelled": 0,
  };

  statusCountsAgg.forEach((item) => {
    if (statusMap[item._id] !== undefined) {
      statusMap[item._id] = item.count;
    }
  });

  const activeOrdersCount =
    (statusMap["Kitchen Preparing"] || 0) + (statusMap["In Transit"] || 0);

  // Response rate calculation
  let responseRate = "100% Response Rate";
  if (totalInquiriesCount > 0) {
    const rate = Math.round((resolvedInquiriesCount / totalInquiriesCount) * 100);
    responseRate = `${rate}% Response Rate`;
  }

  // Format Recent Orders
  const formattedRecentOrders = recentOrdersDocs.map((order) => ({
    _id: order._id,
    id: order.orderId || String(order._id).slice(-6).toUpperCase(),
    orderId: order.orderId,
    createdAt: order.createdAt,
    customer: order.customer,
    shippingAddress: {
      name: order.customer?.name || "Customer",
      city: order.customer?.city || "Jaipur",
      address: order.customer?.address || "",
    },
    items: order.items || [],
    pricing: {
      subtotal: order.pricing?.itemsTotal || 0,
      discount: order.pricing?.discountAmount || 0,
      shipping: order.pricing?.shippingFee || 0,
      totalAmount: order.pricing?.grandTotal || 0,
      grandTotal: order.pricing?.grandTotal || 0,
    },
    status:
      order.status === "Kitchen Preparing"
        ? "preparing"
        : order.status === "In Transit"
        ? "in-transit"
        : order.status === "Delivered"
        ? "delivered"
        : "cancelled",
    statusLabel: order.status,
  }));

  // Top Products: If order items are fewer than 4, fill in from active products
  let topProducts = [];
  if (topOrderedProductsAgg && topOrderedProductsAgg.length > 0) {
    // Populate category info for products if possible
    const productIds = topOrderedProductsAgg
      .map((p) => p.productId)
      .filter(Boolean);
    const populatedProducts = await Product.find({ _id: { $in: productIds } })
      .populate("category", "name")
      .lean();

    const productMap = new Map(
      populatedProducts.map((p) => [p._id.toString(), p])
    );

    topProducts = topOrderedProductsAgg.map((item) => {
      const prod = item.productId ? productMap.get(item.productId.toString()) : null;
      return {
        name: item.name,
        category: prod?.category?.name || "Snacks & Sweets",
        sales: `${item.totalSold} packs sold`,
        price: `₹${item.price || prod?.sellingPrice || 0}`,
        rating: prod?.averageRating || 4.9,
        image: item.image || prod?.images?.[0]?.url || "",
      };
    });
  }

  // If topProducts is less than 4, complement with catalog bestsellers or featured products
  if (topProducts.length < 4) {
    const existingNames = new Set(topProducts.map((p) => p.name));
    const fallbackProducts = await Product.find({
      isDeleted: false,
      status: true,
      name: { $nin: Array.from(existingNames) },
    })
      .sort({ isBestSeller: -1, isFeatured: -1, averageRating: -1 })
      .limit(4 - topProducts.length)
      .populate("category", "name")
      .lean();

    const fallbackFormatted = fallbackProducts.map((prod) => ({
      name: prod.name,
      category: prod.category?.name || "Special Delicacy",
      sales: prod.isBestSeller ? "Top Seller" : "Bestseller",
      price: `₹${prod.sellingPrice}`,
      rating: prod.averageRating || 4.9,
      image: prod.images?.[0]?.url || "",
    }));

    topProducts = [...topProducts, ...fallbackFormatted];
  }

  return {
    stats: {
      totalRevenue: totalGrossRevenue,
      revenueChange: revenueChangeText,
      ordersCount: totalOrdersCount,
      activeOrdersCount,
      productsCount: activeProductsCount,
      categoriesCount: activeCategoriesCount,
      inquiriesCount: totalInquiriesCount,
      responseRate,
    },
    recentOrders: formattedRecentOrders,
    topProducts,
    orderStatusCounts: {
      preparing: statusMap["Kitchen Preparing"] || 0,
      inTransit: statusMap["In Transit"] || 0,
      delivered: statusMap["Delivered"] || 0,
      cancelled: statusMap["Cancelled"] || 0,
    },
  };
};

export default getAdminDashboardService;
