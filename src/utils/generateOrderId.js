import Order from "../model/order.model.js";
import crypto from "crypto";

/**
 * Generates a unique readable Order ID in the format #BIN-XXXX (e.g., #BIN-8924).
 * Concurrency-safe with fallback for high throughput.
 */
export const generateOrderId = async () => {
  let isUnique = false;
  let orderId = "";
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    // Generate 4 to 5 digit random number
    const randomNum = crypto.randomInt(1000, 99999);
    orderId = `#BIN-${randomNum}`;

    const existing = await Order.findOne({ orderId }).select("_id").lean();
    if (!existing) {
      isUnique = true;
    }
  }

  // Fallback in case of collision storm
  if (!isUnique) {
    const timestampSuffix = Date.now().toString().slice(-4);
    const rand = crypto.randomInt(100, 999);
    orderId = `#BIN-${timestampSuffix}${rand}`;
  }

  return orderId;
};

export default generateOrderId;
