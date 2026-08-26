import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
    {
        // ======================================
        // BASIC INFORMATION
        // ======================================

        name: {
            type: String,
            required: [true, "Admin Name is Required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Admin Email is Required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["admin", "super_admin"],
            default: "admin",
        },

        // ======================================
        // ACCOUNT STATUS
        // ======================================

        isActive: {
            type: Boolean,
            default: true,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },

        // ======================================
        // TOKEN MANAGEMENT
        // ======================================

        refreshToken: {
            type: String,
            default: null,
            select: false,
        },

        tokenVersion: {
            type: Number,
            default: 0,
        },

        // ======================================
        // SECURITY TRACKING
        // ======================================

        lastLogin: {
            type: Date,
            default: null,
        },

        lastLoginIP: {
            type: String,
            default: null,
        },

        passwordChangedAt: {
            type: Date,
            default: null,
        },

        // ======================================
        // FORGOT PASSWORD OTP
        // ======================================

        resetOtp: {
            type: String,
            default: null,
            select: false,
        },

        resetOtpExpire: {
            type: Date,
            default: null,
            select: false,
        },

        isOtpVerified: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

// ======================================
// HASH PASSWORD BEFORE SAVE
// ======================================

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// ======================================
// COMPARE PASSWORD
// ======================================

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
