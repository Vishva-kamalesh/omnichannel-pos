const redisClient = require("../config/redis");

/**
 * Thin wrapper around the shared Redis client.
 * Every method is a no-op when Redis is unavailable so the API
 * keeps working even if cache is down.
 */
const isReady = () => Boolean(redisClient && redisClient.isReady);

const redisService = {
  async get(key) {
    if (!isReady()) return null;
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error(`Redis GET error (${key}):`, err.message);
      return null;
    }
  },

  async set(key, value, expiryInSeconds = 3600) {
    if (!isReady()) return false;
    try {
      await redisClient.set(key, JSON.stringify(value), { EX: expiryInSeconds });
      return true;
    } catch (err) {
      console.error(`Redis SET error (${key}):`, err.message);
      return false;
    }
  },

  async del(key) {
    if (!isReady()) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (err) {
      console.error(`Redis DEL error (${key}):`, err.message);
      return false;
    }
  },

  async delByPattern(pattern) {
    if (!isReady()) return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (err) {
      console.error(`Redis DEL pattern error (${pattern}):`, err.message);
      return false;
    }
  },
};

module.exports = redisService;
