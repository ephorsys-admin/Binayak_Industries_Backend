import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  mrp: {
    type: Number,
    required: true,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    default: "Piece",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  itemTotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
    minlength: [2, "Customer name must be at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Customer email is required"],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Customer phone number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Delivery address is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  state: {
    type: String,
    default: "Rajasthan",
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
    default: "",
  },
  addressType: {
    type: String,
    enum: ["Home", "Work / Office", "Work", "Other"],
    default: "Home",
  },
  deliveryNotes: {
    type: String,
    trim: true,
    default: "",
  },
  isOrderingForSomeoneElse: {
    type: Boolean,
    default: false,
  },
  recipient: {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    giftMessage: {
      type: String,
      trim: true,
      default: "",
    },
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ["Kitchen Preparing", "In Transit", "Delivered", "Cancelled"],
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  note: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
    },
    guestToken: {
      type: String,
      trim: true,
      default: "",
    },
    isOrderingForSomeoneElse: {
      type: Boolean,
      default: false,
    },
    recipient: {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
      giftMessage: {
        type: String,
        trim: true,
        default: "",
      },
    },
    customer: {
      type: customerSchema,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "An order must contain at least one item",
      },
    },
    pricing: {
      itemsTotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      couponCode: {
        type: String,
        default: "",
      },
      shippingFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: ["Kitchen Preparing", "In Transit", "Delivered", "Cancelled"],
      default: "Kitchen Preparing",
      index: true,
    },
    statusHistory: [statusHistorySchema],
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-find hook to exclude soft-deleted records by default
orderSchema.pre(/^find/, function () {
  this.find({ isDeleted: false });
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
