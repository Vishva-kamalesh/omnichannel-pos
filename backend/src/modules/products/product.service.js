const Product = require("./product.model");
const ApiError = require("../../utils/ApiError");
const redisClient = require("../../config/redis");

/**
 * @description Create a new product
 * @param {Object} productData 
 * @returns {Promise<Object>}
 */
const createProduct = async (productData) => {
  // Check if SKU already exists
  const existingSku = await Product.findOne({ sku: productData.sku });
  if (existingSku) {
    throw new ApiError(400, "Product with this SKU already exists");
  }

  // Check if Barcode already exists
  if (productData.barcode) {
    const existingBarcode = await Product.findOne({ barcode: productData.barcode });
    if (existingBarcode) {
      throw new ApiError(400, "Product with this barcode already exists");
    }
  }

  const product = await Product.create(productData);
  
  // Invalidate relevant caches
  if (redisClient.isReady) {
    try {
      const keys = await redisClient.keys("products_*");
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
      console.error("Redis Cache Invalidation Error:", err.message);
    }
  }
  
  return product;
};

/**
 * @description Get all products with pagination, search and filtering
 * @param {Object} query 
 * @returns {Promise<Object>}
 */
const getAllProducts = async (query) => {
  const { page = 1, limit = 10, search, category, lowStock, storeId } = query;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { isActive: true };
  
  if (storeId) filter.storeId = storeId;
  if (category) filter.category = category;
  if (lowStock === "true") filter.stock = { $lte: 10 }; // Low stock threshold

  if (search) {
    filter.$text = { $search: search };
  }

  // Cache key based on query parameters
  const cacheKey = `products_${JSON.stringify(query)}`;
  
  if (redisClient.isReady) {
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error("Redis Get Error:", err.message);
    }
  }

  const products = await Product.find(filter)
    .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(filter);

  const result = {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };

  // Cache the result for 5 minutes
  if (redisClient.isReady) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 });
    } catch (err) {
      console.error("Redis Set Error:", err.message);
    }
  }

  return result;
};

/**
 * @description Get single product by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

/**
 * @description Get product by Barcode (Optimized for POS scanning)
 * @param {string} barcode 
 * @returns {Promise<Object>}
 */
const getProductByBarcode = async (barcode) => {
  const cacheKey = `product_barcode_${barcode}`;
  
  if (redisClient.isReady) {
    try {
      const cachedProduct = await redisClient.get(cacheKey);
      if (cachedProduct) return JSON.parse(cachedProduct);
    } catch (err) {
      console.error("Redis Get Error:", err.message);
    }
  }

  const product = await Product.findOne({ barcode, isActive: true });
  if (!product) {
    throw new ApiError(404, "Product with this barcode not found");
  }

  // Cache individual product lookup for 1 hour
  if (redisClient.isReady) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(product), { EX: 3600 });
    } catch (err) {
      console.error("Redis Set Error:", err.message);
    }
  }

  return product;
};

/**
 * @description Update product details
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Invalidate caches
  if (redisClient.isReady) {
    try {
      await redisClient.del(`product_barcode_${product.barcode}`);
      const keys = await redisClient.keys("products_*");
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
      console.error("Redis Invalidation Error:", err.message);
    }
  }

  return product;
};

/**
 * @description Soft delete a product
 * @param {string} id 
 * @returns {Promise<Object>}
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id, 
    { isActive: false }, 
    { new: true }
  );
  
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Invalidate caches
  if (redisClient.isReady) {
    try {
      await redisClient.del(`product_barcode_${product.barcode}`);
      const keys = await redisClient.keys("products_*");
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
      console.error("Redis Invalidation Error:", err.message);
    }
  }

  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByBarcode,
  updateProduct,
  deleteProduct,
};
