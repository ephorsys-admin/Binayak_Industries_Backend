import asyncHandler from "express-async-handler";
import { createOrderService } from "../../services/orders/createOrder.service.js";
import { getAllOrdersService } from "../../services/orders/getAllOrders.service.js";
import { getSingleOrderService } from "../../services/orders/getSingleOrder.service.js";
import { updateOrderStatusService } from "../../services/orders/updateOrderStatus.service.js";

// ==========================================================
// Storefront Controllers (Public)
// ==========================================================

/**
 * Public Checkout Controller: Creates order, calculates pricing on server, sends email, broadcasts via socket.
 */
export const createOrder = asyncHandler(async (req, res) => {
  const order = await createOrderService(req.body);

  // Broadcast real-time order alert to Admin Panel
  const io = req.app.get("io");
  if (io) {
    io.emit("new_order", order);
  }

  return res.status(201).json({
    success: true,
    message: "Order placed successfully! A confirmation email has been sent to your email address.",
    data: order,
  });
});

// ==========================================================
// Admin Controllers (Protected)
// ==========================================================

/**
 * Admin Get All Orders with Search, Status Filtering, and Pagination
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const result = await getAllOrdersService(req.query);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Admin Get Single Order Details
 */
export const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await getSingleOrderService(id);

  return res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * Admin Update Order Status (Enforces Terminal State Immutability for Delivered / Cancelled)
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const adminId = req.admin?._id;

  const order = await updateOrderStatusService({
    orderId: id,
    newStatus: status,
    adminId,
    note,
  });

  // Real-time broadcast status change
  const io = req.app.get("io");
  if (io) {
    io.emit("order_status_updated", order);
  }

  return res.status(200).json({
    success: true,
    message: `Order status updated to "${order.status}" successfully.`,
    data: order,
  });
});
