const mongoose = require("mongoose");
const Store = require("../src/modules/stores/store.model");
const Product = require("../src/modules/products/product.model");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/omnichannel_pos");
    console.log("Connected to MongoDB...");

    // Create a Store
    const store = await Store.findOneAndUpdate(
      { name: "Chennai Main Store" },
      { location: "Chennai, TN", isActive: true },
      { upsert: true, new: true }
    );
    console.log("✅ Seeded Store ID:", store._id);

    // Create a Product
    const product = await Product.findOneAndUpdate(
      { sku: "IPHONE-15-PRO" },
      { 
        name: "iPhone 15 Pro", 
        category: "Electronics", 
        price: 120000, 
        costPrice: 90000, 
        storeId: store._id 
      },
      { upsert: true, new: true }
    );
    console.log("✅ Seeded Product ID:", product._id);

    console.log("\n--- TEST PAYLOAD ---");
    console.log(JSON.stringify({
      productId: product._id,
      storeId: store._id,
      quantity: 50,
      remarks: "Initial stock seeding"
    }, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
