const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    address: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
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

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
