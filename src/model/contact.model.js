import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // ==========================================================
    // Customer Information
    // ==========================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    // ==========================================================
    // Contact Reason
    // ==========================================================

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================================
    // Status
    // ==========================================================

    status: {
      type: String,
      enum: ["Pending", "Contacted", "Resolved"],
      default: "Pending",
    },

    // ==========================================================
    // Soft Delete
    // ==========================================================

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
