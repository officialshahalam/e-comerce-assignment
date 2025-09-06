import * as Redis from "ioredis";

const redis = new (Redis as any)(process.env.REDIS_DATABASE_URL!);

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (error:any) => {
  console.error("❌ Redis connection error:", error);
});

export default redis;
