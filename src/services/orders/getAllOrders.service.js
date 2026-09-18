import Order from "../../model/order.model.js";

/**
 * Retrieves all orders with search, tab status filter, pagination, and status count badges for admin.
 */
export const getAllOrdersService = async (query = {}) => {
  const {
    status,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const filter = { isDeleted: false };

  // Status filtering
  if (status && status.toLowerCase() !== "all") {
    filter.status = status;
  }

  // Search by Order ID, Customer Name, City, or Phone
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { orderId: searchRegex },
      { "customer.name": searchRegex },
      { "customer.city": searchRegex },
      { "customer.phone": searchRegex },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortDirection };

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter).sort(sortOptions).skip(skip).limit(limitNum).lean(),
    Order.countDocuments(filter),
  ]);

  // Aggregate tab counts for admin UI badges: All, Kitchen Preparing, In Transit, Delivered, Cancelled
  const [
    allCount,
    kitchenPreparingCount,
    inTransitCount,
    deliveredCount,
    cancelledCount,
  ] = await Promise.all([
    Order.countDocuments({ isDeleted: false }),
    Order.countDocuments({ isDeleted: false, status: "Kitchen Preparing" }),
    Order.countDocuments({ isDeleted: false, status: "In Transit" }),
    Order.countDocuments({ isDeleted: false, status: "Delivered" }),
    Order.countDocuments({ isDeleted: false, status: "Cancelled" }),
  ]);

  return {
    orders,
    pagination: {
      total: totalOrders,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalOrders / limitNum) || 1,
    },
    counts: {
      all: allCount,
      kitchenPreparing: kitchenPreparingCount,
      inTransit: inTransitCount,
      delivered: deliveredCount,
      cancelled: cancelledCount,
    },
  };
};
