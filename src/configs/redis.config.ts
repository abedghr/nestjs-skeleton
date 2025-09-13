import { registerAs } from '@nestjs/config';

export default registerAs(
    'redis',
    (): Record<string, any> => ({
        cache: {
            host: process.env.REDIS_CACHE_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_CACHE_PORT) ?? 6379,
            username: process.env.REDIS_CACHE_USERNAME,
            password: process.env.REDIS_CACHE_PASSWORD,
            tls: process.env.REDIS_CACHE_TLS === 'true' ? {} : undefined,
            db: parseInt(process.env.REDIS_CACHE_DB) ?? 0,
            connectTimeout:
                parseInt(process.env.REDIS_CACHE_CONNECT_TIMEOUT) ?? 10000,
            commandTimeout:
                parseInt(process.env.REDIS_CACHE_COMMAND_TIMEOUT) ?? 5000,
            retryDelayOnFailover:
                parseInt(process.env.REDIS_CACHE_RETRY_DELAY) ?? 100,
            maxRetriesPerRequest:
                parseInt(process.env.REDIS_CACHE_MAX_RETRIES) ?? 3,
            lazyConnect: process.env.REDIS_CACHE_LAZY_CONNECT === 'true',
        },

        queue: {
            host: process.env.REDIS_QUEUE_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_QUEUE_PORT) ?? 6379,
            username: process.env.REDIS_QUEUE_USERNAME,
            password: process.env.REDIS_QUEUE_PASSWORD,
            tls: process.env.REDIS_QUEUE_TLS === 'true' ? {} : undefined,
            db: parseInt(process.env.REDIS_QUEUE_DB) ?? 2,
        },
    })
);
