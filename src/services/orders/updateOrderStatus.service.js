import Order from "../../model/order.model.js";
import ApiError from "../../utils/ApiError.js";
import sendOrderDeliveredEmail from "../../utils/sendOrderDeliveredEmail.js";
import sendOrderCancelledEmail from "../../utils/sendOrderCancelledEmail.js";

const VALID_STATUSES = ["Kitchen Preparing", "In Transit", "Delivered", "Cancelled"];

/**
 * Updates order status with strict terminal constraints (Delivered and Cancelled cannot be changed).
 * Automatically sends professional email notifications to client when Delivered or Cancelled.
 */
export const updateOrderStatusService = async ({ orderId, newStatus, adminId, note = "" }) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed statuses are: ${VALID_STATUSES.join(", ")}`
    );
  }

  const order = await Order.findById(orderId);
  if (!order || order.isDeleted) {
    throw new ApiError(404, "Order not found");
  }

  // ==========================================================
  // Terminal Status Validation
  // ==========================================================
  if (order.status === "Delivered") {
    throw new ApiError(
      400,
      "Order status is already 'Delivered'. Delivered orders cannot be changed to any other status."
    );
  }

  if (order.status === "Cancelled") {
    throw new ApiError(
      400,
      "Order status is already 'Cancelled'. Cancelled orders cannot be changed to any other status."
    );
  }

  // If no change, return immediately
  if (order.status === newStatus) {
    return order;
  }

  // Record status update in history
  order.status = newStatus;
  order.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: adminId || null,
    note: note || `Status changed to ${newStatus}`,
  });

  // Automatically update payment status when delivered or cancelled for COD
  if (newStatus === "Delivered" && order.paymentStatus === "Pending") {
    order.paymentStatus = "Paid";
  } else if (newStatus === "Cancelled") {
    order.paymentStatus = "Cancelled";
  }

  await order.save();

  // Asynchronously send status update emails
  if (newStatus === "Delivered") {
    sendOrderDeliveredEmail({ order }).catch((err) =>
      console.error("Delivered email error:", err)
    );
  } else if (newStatus === "Cancelled") {
    sendOrderCancelledEmail({ order, reason: note }).catch((err) =>
      console.error("Cancelled email error:", err)
    );
  }

  return order;
};
