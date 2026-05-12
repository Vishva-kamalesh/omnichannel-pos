const redisClient = require("../../config/redis");

/**
 * @description Helper functions for Inventory Redis caching
 */
const inventoryCache = {
  /**
   * @description Get inventory from cache
   * @param {string} productId 
   * @param {string} storeId 
   */
  async get(productId, storeId) {
    try {
      const key = `inventory:${productId}:${storeId}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Redis Get Error:", error);
      return null;
    }
  },

  /**
   * @description Set inventory to cache
   * @param {string} productId 
   * @param {string} storeId 
   * @param {Object} data 
   */
  async set(productId, storeId, data) {
    try {
      const key = `inventory:${productId}:${storeId}`;
      // Cache for 1 hour
      await redisClient.setEx(key, 3600, JSON.stringify(data));
    } catch (error) {
      console.error("Redis Set Error:", error);
    }
  },

  /**
   * @description Invalidate inventory cache
   * @param {string} productId 
   * @param {string} storeId 
   */
  async invalidate(productId, storeId) {
    try {
      const key = `inventory:${productId}:${storeId}`;
      await redisClient.del(key);
      
      // Also invalidate low stock caches if any
      const lowStockKey = `inventory:low-stock:*`;
      const keys = await redisClient.keys(lowStockKey);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error("Redis Invalidate Error:", error);
    }
  },

  /**
   * @description Cache low stock products
   */
  async setLowStock(storeId, data) {
    try {
      const key = `inventory:low-stock:${storeId || "all"}`;
      await redisClient.setEx(key, 1800, JSON.stringify(data)); // 30 mins
    } catch (error) {
      console.error("Redis SetLowStock Error:", error);
    }
  },

  /**
   * @description Get low stock from cache
   */
  async getLowStock(storeId) {
    try {
      const key = `inventory:low-stock:${storeId || "all"}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Redis GetLowStock Error:", error);
      return null;
    }
  }
};

module.exports = { inventoryCache };
