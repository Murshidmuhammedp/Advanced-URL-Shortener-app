import Redis from "ioredis";

const redis = new Redis({
    host: 'redis',
    port: 6379
});

redis.on('error', (error) => {
    console.error('Redis error:', error);
});

export default redis;