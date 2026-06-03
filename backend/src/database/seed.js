require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../modules/users/user.model");
const Store = require("../modules/stores/store.model");
const Product = require("../modules/products/product.model");
const Inventory = require("../modules/inventory/inventory.model");
const Order = require("../modules/orders/order.model");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/omnichannel_pos";

const log = (msg) => console.log(`[seed] ${msg}`);

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function generateOrderNumber(i) {
  const ts = Date.now().toString(36).toUpperCase();
  const seq = i.toString(36).toUpperCase().padStart(4, "0");
  return `ORD-${ts}-${seq}`;
}

const STORE_SEED = [
  { name: "Downtown Flagship", location: "Mumbai, IN", address: "Marine Drive, Mumbai 400020", contactNumber: "+91 22 1234 5678", email: "downtown@vendra.app" },
  { name: "Bandra West Outlet", location: "Mumbai, IN", address: "Linking Road, Bandra West, Mumbai 400050", contactNumber: "+91 22 2345 6789", email: "bandra@vendra.app" },
  { name: "Connaught Place", location: "New Delhi, IN", address: "Block A, Connaught Place, New Delhi 110001", contactNumber: "+91 11 3456 7890", email: "cp@vendra.app" },
  { name: "Indiranagar Express", location: "Bengaluru, IN", address: "100 Feet Road, Indiranagar, Bengaluru 560038", contactNumber: "+91 80 4567 8901", email: "indiranagar@vendra.app" },
  { name: "Koramangala Hub", location: "Bengaluru, IN", address: "80 Feet Road, Koramangala 5th Block, Bengaluru 560095", contactNumber: "+91 80 5678 9012", email: "koramangala@vendra.app" },
  { name: "Park Street Store", location: "Kolkata, IN", address: "Park Street, Kolkata 700016", contactNumber: "+91 33 6789 0123", email: "parkstreet@vendra.app" },
  { name: "T. Nagar Counter", location: "Chennai, IN", address: "Ranganathan Street, T. Nagar, Chennai 600017", contactNumber: "+91 44 7890 1234", email: "tnagar@vendra.app" },
  { name: "Banjara Hills", location: "Hyderabad, IN", address: "Road No 12, Banjara Hills, Hyderabad 500034", contactNumber: "+91 40 8901 2345", email: "banjara@vendra.app" },
  { name: "Sector 17 Plaza", location: "Chandigarh, IN", address: "Sector 17, Chandigarh 160017", contactNumber: "+91 172 9012 345", email: "sec17@vendra.app" },
  { name: "FC Road Express", location: "Pune, IN", address: "Fergusson College Road, Pune 411004", contactNumber: "+91 20 1023 4567", email: "fcroad@vendra.app" },
];

const USER_SEED = [
  { name: "Admin", email: "admin@vendra.app", password: "Admin@12345", role: "admin" },
  { name: "Maya Patel", email: "manager@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Riya Sharma", email: "cashier@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Arjun Mehta", email: "arjun.mehta@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Priya Iyer", email: "priya.iyer@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Vikram Singh", email: "vikram.singh@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Neha Gupta", email: "neha.gupta@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Rohan Verma", email: "rohan.verma@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Ananya Reddy", email: "ananya.reddy@vendra.app", password: "Manager@123", role: "manager" },
  { name: "Karan Kapoor", email: "karan.kapoor@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Ishita Bose", email: "ishita.bose@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Aditya Joshi", email: "aditya.joshi@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Sneha Nair", email: "sneha.nair@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Devansh Rao", email: "devansh.rao@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Tanvi Shah", email: "tanvi.shah@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Raj Malhotra", email: "raj.malhotra@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Kavya Pillai", email: "kavya.pillai@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Siddharth Khanna", email: "siddharth.khanna@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Aishwarya Das", email: "aishwarya.das@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Harsh Bhatia", email: "harsh.bhatia@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Pooja Saxena", email: "pooja.saxena@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Nikhil Chawla", email: "nikhil.chawla@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Meera Krishnan", email: "meera.krishnan@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Yash Agarwal", email: "yash.agarwal@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Divya Menon", email: "divya.menon@vendra.app", password: "Cashier@123", role: "cashier" },
  { name: "Aryan Bhatt", email: "aryan.bhatt@vendra.app", password: "Cashier@123", role: "cashier" },
];

const PRODUCT_SEED = [
  // Beverages
  { name: "Cold Brew Coffee 250ml", sku: "BEV-CB-250", barcode: "8901001000011", category: "Beverages", price: 149, costPrice: 80 },
  { name: "Masala Chai Premium 200g", sku: "BEV-MC-200", barcode: "8901001000012", category: "Beverages", price: 280, costPrice: 160 },
  { name: "Sparkling Water 750ml", sku: "BEV-SW-750", barcode: "8901001000013", category: "Beverages", price: 90, costPrice: 45 },
  { name: "Fresh Orange Juice 1L", sku: "BEV-OJ-1L", barcode: "8901001000014", category: "Beverages", price: 180, costPrice: 110 },
  { name: "Coconut Water 500ml", sku: "BEV-CW-500", barcode: "8901001000015", category: "Beverages", price: 65, costPrice: 30 },
  // Snacks
  { name: "Granola Energy Bar", sku: "SNK-GEB-040", barcode: "8901001000028", category: "Snacks", price: 75, costPrice: 32 },
  { name: "Roasted Chickpeas 200g", sku: "SNK-RC-200", barcode: "8901001000029", category: "Snacks", price: 110, costPrice: 55 },
  { name: "Dark Chocolate Bar 100g", sku: "SNK-DC-100", barcode: "8901001000030", category: "Snacks", price: 195, costPrice: 95 },
  { name: "Multigrain Crackers 150g", sku: "SNK-MG-150", barcode: "8901001000031", category: "Snacks", price: 130, costPrice: 60 },
  { name: "Mixed Berry Trail Mix 250g", sku: "SNK-TM-250", barcode: "8901001000032", category: "Snacks", price: 320, costPrice: 175 },
  // Grocery
  { name: "Organic Almonds 200g", sku: "GRC-OA-200", barcode: "8901001000035", category: "Grocery", price: 320, costPrice: 210 },
  { name: "Basmati Rice 5kg", sku: "GRC-BR-5KG", barcode: "8901001000036", category: "Grocery", price: 620, costPrice: 420 },
  { name: "Whole Wheat Atta 5kg", sku: "GRC-WA-5KG", barcode: "8901001000037", category: "Grocery", price: 285, costPrice: 195 },
  { name: "Cold Pressed Olive Oil 1L", sku: "GRC-OO-1L", barcode: "8901001000038", category: "Grocery", price: 780, costPrice: 510 },
  { name: "Organic Honey 500g", sku: "GRC-HN-500", barcode: "8901001000039", category: "Grocery", price: 425, costPrice: 230 },
  { name: "Quinoa 500g", sku: "GRC-QN-500", barcode: "8901001000040", category: "Grocery", price: 290, costPrice: 175 },
  // Personal Care
  { name: "Bamboo Toothbrush", sku: "PCR-BTB-001", barcode: "8901001000042", category: "Personal Care", price: 99, costPrice: 45 },
  { name: "Herbal Face Wash 100ml", sku: "PCR-FW-100", barcode: "8901001000043", category: "Personal Care", price: 240, costPrice: 110 },
  { name: "Argan Hair Oil 200ml", sku: "PCR-AH-200", barcode: "8901001000044", category: "Personal Care", price: 520, costPrice: 280 },
  { name: "Charcoal Body Soap 100g", sku: "PCR-CS-100", barcode: "8901001000045", category: "Personal Care", price: 120, costPrice: 55 },
  { name: "Sunscreen SPF 50 100ml", sku: "PCR-SS-100", barcode: "8901001000046", category: "Personal Care", price: 595, costPrice: 320 },
  // Dairy
  { name: "Greek Yogurt 400g", sku: "DRY-GY-400", barcode: "8901001000050", category: "Dairy", price: 165, costPrice: 90 },
  { name: "Artisan Cheese 250g", sku: "DRY-AC-250", barcode: "8901001000051", category: "Dairy", price: 380, costPrice: 230 },
  { name: "Salted Butter 200g", sku: "DRY-SB-200", barcode: "8901001000052", category: "Dairy", price: 240, costPrice: 145 },
  { name: "Fresh Paneer 500g", sku: "DRY-FP-500", barcode: "8901001000053", category: "Dairy", price: 290, costPrice: 175 },
  // Bakery
  { name: "Sourdough Bread 500g", sku: "BAK-SD-500", barcode: "8901001000060", category: "Bakery", price: 220, costPrice: 110 },
  { name: "Butter Croissants 4-pack", sku: "BAK-BC-4PK", barcode: "8901001000061", category: "Bakery", price: 320, costPrice: 165 },
  { name: "Multigrain Muffins 6-pack", sku: "BAK-MM-6PK", barcode: "8901001000062", category: "Bakery", price: 280, costPrice: 140 },
  // Household
  { name: "Eco-Friendly Detergent 1kg", sku: "HHD-ED-1KG", barcode: "8901001000070", category: "Household", price: 340, costPrice: 195 },
  { name: "Bamboo Paper Towels 4-pack", sku: "HHD-PT-4PK", barcode: "8901001000071", category: "Household", price: 240, costPrice: 130 },
  { name: "Citrus Floor Cleaner 1L", sku: "HHD-FC-1L", barcode: "8901001000072", category: "Household", price: 195, costPrice: 105 },
  { name: "Reusable Glass Containers 3-pack", sku: "HHD-GC-3PK", barcode: "8901001000073", category: "Household", price: 690, costPrice: 410 },
];

async function clearOldData() {
  log("clearing existing demo data");
  await Promise.all([
    Order.deleteMany({}),
    Inventory.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    Store.deleteMany({}),
  ]);
}

async function seedStores() {
  const docs = await Store.insertMany(
    STORE_SEED.map((s) => ({ ...s, isActive: true }))
  );
  log(`created ${docs.length} stores`);
  return docs;
}

async function seedUsers(stores) {
  const created = [];
  for (let i = 0; i < USER_SEED.length; i++) {
    const data = USER_SEED[i];
    // Admin floats (no specific store), everyone else gets a store
    const storeId = data.role === "admin" ? undefined : stores[i % stores.length]._id;
    const user = await User.create({ ...data, storeId, isActive: true });
    created.push(user);
  }
  log(`created ${created.length} users`);
  return created;
}

async function seedProducts(primaryStore) {
  const docs = [];
  for (const data of PRODUCT_SEED) {
    const product = await Product.create({
      ...data,
      stock: 0,
      isActive: true,
      storeId: primaryStore._id,
    });
    docs.push(product);
  }
  log(`created ${docs.length} products`);
  return docs;
}

async function seedInventory(stores, products) {
  const rows = [];
  const stockByProduct = new Map();
  for (const store of stores) {
    for (const product of products) {
      // Roughly 90% of (store, product) combos get stocked
      if (Math.random() > 0.9) continue;
      const quantity = randInt(0, 220);
      rows.push({
        productId: product._id,
        storeId: store._id,
        quantity,
        minimumStockLevel: randInt(8, 25),
      });
      const key = product._id.toString();
      stockByProduct.set(key, (stockByProduct.get(key) || 0) + quantity);
    }
  }
  const docs = await Inventory.insertMany(rows);

  // Keep each product's aggregate `stock` in sync with the per-store inventory
  // totals. The dashboard values inventory as Σ(stock × costPrice); without this
  // products keep stock: 0 and the KPI reads ₹0 even though stock clearly exists.
  const ops = products.map((p) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { stock: stockByProduct.get(p._id.toString()) || 0 } },
    },
  }));
  await Product.bulkWrite(ops);

  log(`created ${docs.length} inventory rows across ${stores.length} stores`);
  log(`synced aggregate product stock for inventory valuation`);
  return docs;
}

async function seedOrders(stores, products, users) {
  const cashiers = users.filter((u) => u.role === "cashier" || u.role === "manager");
  const orders = [];

  // ~480 orders over 30 days across 10 stores and 25 staff (~1 order per
  // cashier per day). Keeps lifetime order count plausible against the active
  // cashier headcount, and gives every cashier real activity.
  const TARGET = 480;
  const PAYMENT_METHODS = ["cash", "card", "upi", "credit"];

  // The newest orders are placed "today" and are still settling, so the feed
  // (sorted newest-first, ~8 rows) always shows a real live mix rather than a
  // wall of "Completed". This deterministic tail guarantees Pending/Processing/
  // Completed/Refunded all appear up top, regardless of the random spread below.
  const LIVE_TAIL = [
    "processing",
    "pending",
    "completed",
    "processing",
    "completed",
    "returned",
    "pending",
    "processing",
    "completed",
    "processing",
    "pending",
    "completed",
  ];

  for (let i = 0; i < TARGET; i++) {
    const store = pick(stores);
    const cashier = pick(cashiers);
    const itemCount = randInt(1, 5);
    const orderItems = [];
    const seen = new Set();

    let totalAmount = 0;
    let totalCost = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = pick(products);
      if (seen.has(product._id.toString())) continue;
      seen.add(product._id.toString());

      const quantity = randInt(1, 4);
      const subtotal = product.price * quantity;
      totalAmount += subtotal;
      totalCost += product.costPrice * quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity,
        price: product.price,
        costPrice: product.costPrice,
        subtotal,
      });
    }

    if (orderItems.length === 0) continue;

    const taxRate = 0.05;
    const tax = Math.round(totalAmount * taxRate);
    const discountPct = pick([0, 0, 0, 5, 10]); // bias toward no discount
    const discount = Math.round((totalAmount * discountPct) / 100);
    const finalAmount = Math.max(0, totalAmount + tax - discount);

    // The first LIVE_TAIL.length orders are "today" (newest, in-flight); the
    // rest are spread across the prior 30 days and are terminal. Using i as the
    // hour offset for the tail keeps these strictly newer than everything else,
    // so they own the top of the feed in a fixed, realistic order.
    let status;
    let ageHours;
    if (i < LIVE_TAIL.length) {
      ageHours = i; // i hours ago — deterministic newest-first ordering
      status = LIVE_TAIL[i];
    } else {
      ageHours = randInt(1, 30) * 24 + randInt(0, 23); // 1–30 days ago
      status = Math.random() < 0.9 ? "completed" : pick(["returned", "cancelled"]);
    }
    const createdAt = new Date(Date.now() - ageHours * 60 * 60 * 1000);

    const paymentStatus =
      status === "completed" || status === "processing"
        ? "paid"
        : status === "returned"
          ? "refunded"
          : status === "pending"
            ? "pending"
            : "failed"; // cancelled

    orders.push({
      orderNumber: generateOrderNumber(i),
      items: orderItems,
      totalAmount,
      totalCost,
      tax,
      discount,
      finalAmount,
      paymentMethod: pick(PAYMENT_METHODS),
      paymentStatus,
      status,
      storeId: store._id,
      cashierId: cashier._id,
      createdAt,
      updatedAt: createdAt,
    });
  }

  const docs = await Order.insertMany(orders);
  log(`created ${docs.length} orders spread across 30 days`);
  return docs;
}

async function run() {
  log(`connecting to ${MONGO_URI}`);
  await mongoose.connect(MONGO_URI);

  await clearOldData();
  const stores = await seedStores();
  const users = await seedUsers(stores);
  const products = await seedProducts(stores[0]);
  await seedInventory(stores, products);
  await seedOrders(stores, products, users);

  log("seed complete");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error("[seed] failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
