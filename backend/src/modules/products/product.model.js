const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values if barcode is not provided
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0, "Cost price cannot be negative"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    variants: [
      {
        type: mongoose.Schema.Types.Map,
        of: String,
      },
    ],
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store ID is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookup
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ storeId: 1 });
productSchema.index({ category: 1 });

// Text index for search functionality
productSchema.index(
  { 
    name: "text", 
    sku: "text", 
    barcode: "text",
    description: "text" 
  },
  {
    weights: {
      name: 10,
      sku: 5,
      barcode: 5,
      description: 1
    },
    name: "ProductSearchIndex"
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
