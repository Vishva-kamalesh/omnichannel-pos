const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.warn("⚠️ Redis max retries reached. Caching will be disabled for this session.");
        return false; // Stop retrying
      }
      return Math.min(retries * 500, 2000); // Wait longer between retries
    },
  },
});

redisClient.on("error", (err) => {
  // Only log if it's not a connection refused error, or if it's the first few times
  if (err.code === "ECONNREFUSED") {
    // Optionally log a cleaner message once
  } else {
    console.error("Redis Client Error:", err.message);
  }
});

redisClient.on("connect", () => console.log("✅ Redis Client Connected"));
redisClient.on("ready", () => console.log("🚀 Redis Client Ready"));

(async () => {
  try {
    // We don't await connect here because it will handle it via events
    // and we don't want to block the app if Redis is down
    await redisClient.connect().catch((err) => {
      if (err.code === "ECONNREFUSED") {
        console.warn("⚠️ Redis server not found at localhost:6379. Continuing without cache.");
      }
    });
  } catch (err) {
    // Silently handle
  }
})();

module.exports = redisClient;
