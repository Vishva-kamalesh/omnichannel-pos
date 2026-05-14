const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  costPrice: {
    type: Number,
    required: true,
    min: [0, "Cost price cannot be negative"],
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "credit"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "paid",
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "returned"],
      default: "completed",
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics
orderSchema.index({ createdAt: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ storeId: 1, createdAt: 1 });
orderSchema.index({ cashierId: 1, createdAt: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
