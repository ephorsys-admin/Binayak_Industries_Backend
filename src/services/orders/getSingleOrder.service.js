import Order from "../../model/order.model.js";
import ApiError from "../../utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Fetches single order details by MongoDB _id or orderId string (e.g. #BIN-8924).
 */
export const getSingleOrderService = async (idOrOrderId) => {
  if (!idOrOrderId) {
    throw new ApiError(400, "Order identifier is required");
  }

  let query = { isDeleted: false };

  if (mongoose.Types.ObjectId.isValid(idOrOrderId)) {
    query._id = idOrOrderId;
  } else {
    query.orderId = idOrOrderId.startsWith("#") ? idOrOrderId : `#${idOrOrderId}`;
  }

  const order = await Order.findOne(query)
    .populate("items.product", "name images mrp sellingPrice unit")
    .populate("statusHistory.changedBy", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};
