import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    // ==========================================================
    // Basic Information
    // ==========================================================

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================================
    // Product Images
    // ==========================================================

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    // ==========================================================
    // Hover Animated GIF
    // ==========================================================

    gif: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    // ==========================================================
    // Pricing
    // ==========================================================

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

    // ==========================================================
    // Inventory
    // ==========================================================

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["Piece", "Box", "Pack", "Kg", "Gram", "Liter"],
      default: "Piece",
    },

    // ==========================================================
    // Product Status
    // ==========================================================

    status: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ==========================================================
    // Home Page Sections
    // ==========================================================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    // ==========================================================
    // Services
    // ==========================================================

    homeDelivery: {
      type: Boolean,
      default: true,
    },

    allowInquiry: {
      type: Boolean,
      default: true,
    },

    // ==========================================================
    // Rating
    // ==========================================================

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // ==========================================================
    // Soft Delete
    // ==========================================================

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // ==========================================================
    // Audit
    // ==========================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================================
// Auto Generate Slug
// ==========================================================

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

});

// ==========================================================
// Hide Deleted Products
// ==========================================================

productSchema.pre(/^find/, function () {
  this.find({
    isDeleted: false,
  });

});

const Product = mongoose.model("Product", productSchema);

export default Product;
