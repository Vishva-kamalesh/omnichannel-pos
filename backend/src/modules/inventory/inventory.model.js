const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store ID is required"],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
      index: true,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: [0, "Reserved stock cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.quantity;
        },
        message: "Reserved stock cannot exceed total quantity",
      },
    },
    minimumStockLevel: {
      type: Number,
      default: 0,
      min: [0, "Minimum stock level cannot be negative"],
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Unique index to ensure each product has only one inventory record per store
inventorySchema.index({ productId: 1, storeId: 1 }, { unique: true });

// Virtual for available stock (quantity - reservedStock)
inventorySchema.virtual("availableStock").get(function () {
  return this.quantity - this.reservedStock;
});

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
