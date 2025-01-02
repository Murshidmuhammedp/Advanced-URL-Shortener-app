import Redis from "ioredis";

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

redis.on('error', (error) => {
    console.error('Redis error:', error);
});

export default redis;