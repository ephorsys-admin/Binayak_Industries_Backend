import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
            minlength: [2, "Category name must be at least 2 characters"],
            maxlength: [100, "Category name cannot exceed 100 characters"],
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },

        image: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },

        sortOrder: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

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

// Generate Slug Automatically
categorySchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true,
        });
    }
});

// Hide Deleted Categories by Default
categorySchema.pre(/^find/, function () {
    this.find({ isDeleted: false });
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
