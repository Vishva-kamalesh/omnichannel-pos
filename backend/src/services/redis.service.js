const Redis = require("ioredis");
const logger = require("../utils/logger");

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
      
      this.client = new Redis(redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        console.log("Redis connected successfully");
      });

      this.client.on("error", (err) => {
        this.isConnected = false;
        console.error("Redis connection error:", err.message);
      });

    } catch (error) {
      console.error("Failed to initialize Redis:", error.message);
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error.message);
      return null;
    }
  }

  async set(key, value, expiryInSeconds = 3600) {
    if (!this.isConnected) return false;
    try {
      await this.client.set(key, JSON.stringify(value), "EX", expiryInSeconds);
      return true;
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error.message);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error.message);
      return false;
    }
  }

  async delByPattern(pattern) {
    if (!this.isConnected) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error(`Redis DEL pattern error for ${pattern}:`, error.message);
      return false;
    }
  }
}

const redisService = new RedisService();
redisService.connect();

module.exports = redisService;
