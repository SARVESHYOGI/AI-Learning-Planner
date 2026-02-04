// const redis = require("redis");

// let client;
// if (process.env.REDIS_URL) {
//     client = redis.createClient({ url: process.env.REDIS_URL });
// } else {
//     client = redis.createClient({ socket: { host: "127.0.0.1", port: 6379 } });
// }

// client.on("error", (err) => console.error("Redis error:", err));

// (async () => {
//     try {
//         await client.connect();
//         console.log("Redis connected");
//     } catch (err) {
//         console.error("Redis connection failed, using in-memory fallback", err);
//     }
// })();

// const inMemoryBuckets = new Map();

// module.exports = function rateLimiter({ capacity = 10, refillRatePerSec = 10 / 60 } = {}) {
//     return async (req, res, next) => {
//         const key = req.user ? `rate:user:${req.user.id}` : `rate:ip:${req.ip}`;
//         const now = Date.now();

//         let tokens, lastRefill;

//         try {
//             if (client.isOpen) {
//                 const data = await client.hGetAll(key);
//                 tokens = data.tokens ? parseFloat(data.tokens) : capacity;
//                 lastRefill = data.lastRefill ? parseInt(data.lastRefill) : now;
//             } else throw new Error("Redis not connected");
//         } catch {
//             if (!inMemoryBuckets.has(key)) inMemoryBuckets.set(key, { tokens: capacity, lastRefill: now });
//             const bucket = inMemoryBuckets.get(key);
//             tokens = bucket.tokens;
//             lastRefill = bucket.lastRefill;
//         }

//         const elapsed = (now - lastRefill) / 1000;
//         tokens = Math.min(capacity, tokens + elapsed * refillRatePerSec);

//         if (tokens < 1) {
//             return res.status(429).json({ success: false, message: "Rate limit exceeded. Try later." });
//         }

//         tokens -= 1;

//         try {
//             if (client.isOpen) {
//                 await client.hSet(key, { tokens, lastRefill: now });
//                 await client.expire(key, 120);
//             } else {
//                 inMemoryBuckets.set(key, { tokens, lastRefill: now });
//             }
//         } catch {
//             inMemoryBuckets.set(key, { tokens, lastRefill: now });
//         }

//         next();
//     };
// };

const buckets = new Map();

function rateLimiter({ windowMs = 60_000, max = 5 } = {}) {
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();

        if (!buckets.has(key)) buckets.set(key, []);

        const timestamps = buckets.get(key);
        while (timestamps.length && timestamps[0] <= now - windowMs) {
            timestamps.shift();
        }

        if (timestamps.length >= max) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Try later."
            });
        }

        timestamps.push(now);
        next();
    };
}
rateLimiter._clear = () => buckets.clear();
module.exports = rateLimiter;
