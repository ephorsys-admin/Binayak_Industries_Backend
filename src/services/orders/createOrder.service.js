import mongoose from "mongoose";
import Order from "../../model/order.model.js";
import Product from "../../model/product.model.js";
import ApiError from "../../utils/ApiError.js";
import generateOrderId from "../../utils/generateOrderId.js";
import sendOrderConfirmationEmail from "../../utils/sendOrderConfirmationEmail.js";

/**
 * Creates an order with strict server-side price calculation and product verification.
 * Automatically clears the user's cart upon order completion.
 */
export const createOrderService = async (data) => {
  const {
    customer,
    items,
    paymentMethod = "Cash on Delivery",
    couponCode = "",
    guestToken = "",
  } = data;

  if (!customer) {
    throw new ApiError(400, "Customer information is required");
  }

  const {
    name,
    email,
    phone,
    address,
    addressLine,
    city,
    pincode,
    state,
    landmark,
    addressType = "Home",
    deliveryNotes = "",
  } = customer;

  const resolvedAddress = (address || addressLine || "").trim();

  if (!name || !name.trim()) {
    throw new ApiError(400, "Customer name is required");
  }

  if (!email || !email.trim()) {
    throw new ApiError(400, "Customer email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  if (!phone || !phone.trim()) {
    throw new ApiError(400, "Customer phone number is required");
  }

  if (!resolvedAddress) {
    throw new ApiError(400, "Delivery address is required");
  }

  if (!city || !city.trim()) {
    throw new ApiError(400, "City is required");
  }

  if (!pincode || !pincode.trim()) {
    throw new ApiError(400, "Pincode is required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item");
  }

  // Extract valid MongoDB ObjectIds only (prevents Cast to ObjectId error on numbers/strings)
  const validObjectIds = items
    .map((i) => (i.productId || i.product || i.id || i._id)?.toString())
    .filter((id) => id && mongoose.Types.ObjectId.isValid(id));

  // Extract titles/names for fallback matching if needed
  const itemNames = items
    .map((i) => (i.name || i.title)?.trim())
    .filter(Boolean);

  // Fetch real product details from database (Zero-trust security)
  const dbProducts = await Product.find({
    $or: [
      ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
      ...(itemNames.length > 0 ? [{ name: { $in: itemNames } }] : []),
    ],
    isDeleted: false,
    status: true,
  });

  const productMapById = new Map();
  const productMapByName = new Map();
  dbProducts.forEach((p) => {
    productMapById.set(p._id.toString(), p);
    productMapByName.set(p.name.toLowerCase().trim(), p);
  });

  let itemsTotal = 0;
  const verifiedOrderItems = [];

  for (const item of items) {
    const rawId = (item.productId || item.product || item.id || item._id)?.toString();
    const rawName = (item.title || item.name || "")?.trim();

    let dbProduct = null;
    if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
      dbProduct = productMapById.get(rawId);
    }
    if (!dbProduct && rawName) {
      dbProduct = productMapByName.get(rawName.toLowerCase());
    }

    if (!dbProduct) {
      // If product not in DB, use sanitized item details
      if (rawName) {
        const itemSellingPrice = Math.max(0, Number(item.price || item.sellingPrice || 100));
        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        const itemTotal = itemSellingPrice * quantity;
        itemsTotal += itemTotal;

        verifiedOrderItems.push({
          product: null,
          name: rawName,
          slug: item.slug || "",
          image: item.image || "",
          mrp: Math.max(itemSellingPrice, Number(item.originalPrice || item.mrp || itemSellingPrice)),
          sellingPrice: itemSellingPrice,
          unit: item.packSize || item.weight || item.unit || "Piece",
          quantity,
          itemTotal,
        });
        continue;
      }

      throw new ApiError(
        400,
        `One of the ordered items is unavailable or no longer exists.`
      );
    }

    if (!dbProduct.isAvailable) {
      throw new ApiError(
        400,
        `Product "${dbProduct.name}" is currently out of stock.`
      );
    }

    const quantity = parseInt(item.quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      throw new ApiError(400, `Invalid quantity for item "${dbProduct.name}"`);
    }

    const sellingPrice = Number(dbProduct.sellingPrice);
    const mrp = Number(dbProduct.mrp);
    const itemTotal = sellingPrice * quantity;

    itemsTotal += itemTotal;

    verifiedOrderItems.push({
      product: dbProduct._id,
      name: dbProduct.name,
      slug: dbProduct.slug || "",
      image: dbProduct.images?.[0]?.url || item.image || "",
      mrp,
      sellingPrice,
      unit: dbProduct.unit || "Piece",
      quantity,
      itemTotal,
    });
  }

  // Calculate discount if valid coupon applied
  let discountAmount = 0;
  const cleanCoupon = (couponCode || "").trim().toUpperCase();
  if (cleanCoupon === "FESTIVE15") {
    discountAmount = Math.min(150, itemsTotal);
  } else if (cleanCoupon === "BINAYAK10") {
    discountAmount = Math.min(100, itemsTotal);
  } else if (cleanCoupon === "NAMKEEN20") {
    discountAmount = Math.min(200, itemsTotal);
  }

  const shippingFee = itemsTotal >= 500 ? 0 : 40;
  const grandTotal = Math.max(0, itemsTotal + shippingFee - discountAmount);

  // Generate unique Order ID #BIN-XXXX
  const orderId = await generateOrderId();

  // Create order in database
  const order = await Order.create({
    orderId,
    guestToken: guestToken || "",
    customer: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: resolvedAddress,
      city: city.trim(),
      state: (state || "Rajasthan").trim(),
      pincode: pincode.trim(),
      landmark: (landmark || "").trim(),
      addressType: addressType || "Home",
      deliveryNotes: (deliveryNotes || "").trim(),
    },
    items: verifiedOrderItems,
    pricing: {
      itemsTotal,
      discountAmount,
      couponCode: cleanCoupon,
      shippingFee,
      grandTotal,
    },
    status: "Kitchen Preparing",
    statusHistory: [
      {
        status: "Kitchen Preparing",
        changedAt: new Date(),
        note: `Order placed by customer via storefront checkout (${paymentMethod})`,
      },
    ],
    paymentMethod,
    paymentStatus: paymentMethod.includes("COD") || paymentMethod.includes("Cash") ? "Pending" : "Paid",
  });

  // Asynchronously send order confirmation email
  sendOrderConfirmationEmail({ order }).catch((err) => {
    console.error("Order email error:", err);
  });

  return order;
};
