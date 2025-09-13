// src/common/redis/services/redis.service.ts
import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private redis: Redis;
    private isConnected = false;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.disconnect();
    }

    private async connect(): Promise<void> {
        try {
            const redisConfig: RedisOptions =
                this.configService.get('redis.cache');
            const options: RedisOptions = {
                host: redisConfig.host,
                port: redisConfig.port,
                db: redisConfig.db,
                keyPrefix: redisConfig.keyPrefix,
                connectTimeout: redisConfig.connectTimeout,
                commandTimeout: redisConfig.commandTimeout,
                maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
                lazyConnect: redisConfig.lazyConnect,

                // Connection settings
                family: 4, // 4 (IPv4) or 6 (IPv6)
                keepAlive: 30000, // keepAlive should be a number (milliseconds)

                // Reconnection settings
                enableReadyCheck: true,
                enableOfflineQueue: true,

                // Error handling
                showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
            };

            // Add optional fields only if they exist
            if (redisConfig.username) {
                options.username = redisConfig.username;
            }

            if (redisConfig.password) {
                options.password = redisConfig.password;
            }

            if (redisConfig.tls) {
                options.tls = redisConfig.tls;
            }

            this.redis = new Redis(options);

            this.setupEventListeners();

            // Wait for connection if not lazy
            if (!options.lazyConnect) {
                await this.redis.ping();
            }

            this.isConnected = true;
            this.logger.log('Redis connected successfully');
        } catch (error) {
            this.logger.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    private setupEventListeners(): void {
        this.redis.on('connect', () => {
            this.logger.log('Redis connection established');
            this.isConnected = true;
        });

        this.redis.on('ready', () => {
            this.logger.log('Redis ready to receive commands');
        });

        this.redis.on('error', error => {
            this.logger.error('Redis connection error:', error);
            this.isConnected = false;
        });

        this.redis.on('close', () => {
            this.logger.warn('Redis connection closed');
            this.isConnected = false;
        });

        this.redis.on('reconnecting', delay => {
            this.logger.log(`Redis reconnecting in ${delay}ms`);
        });

        this.redis.on('end', () => {
            this.logger.warn('Redis connection ended');
            this.isConnected = false;
        });
    }

    private async disconnect(): Promise<void> {
        if (this.redis) {
            try {
                await this.redis.quit();
                this.logger.log('Redis disconnected gracefully');
            } catch (error) {
                this.logger.error('Error during Redis disconnect:', error);
                this.redis.disconnect();
            }
        }
    }

    // Health check methods
    isHealthy(): boolean {
        return this.isConnected && this.redis?.status === 'ready';
    }

    async ping(): Promise<string> {
        this.ensureConnected();
        return await this.redis.ping();
    }

    private ensureConnected(): void {
        if (!this.isHealthy()) {
            throw new Error('Redis is not connected or ready');
        }
    }

    // Basic operations
    async get(key: string): Promise<string | null> {
        this.ensureConnected();
        return await this.redis.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
        this.ensureConnected();
        if (ttlSeconds) {
            return await this.redis.setex(key, ttlSeconds, value);
        }
        return await this.redis.set(key, value);
    }

    async del(...keys: string[]): Promise<number> {
        this.ensureConnected();
        if (keys.length === 0) return 0;
        return await this.redis.del(...keys);
    }

    async exists(...keys: string[]): Promise<number> {
        this.ensureConnected();
        if (keys.length === 0) return 0;
        return await this.redis.exists(...keys);
    }

    async expire(key: string, seconds: number): Promise<number> {
        this.ensureConnected();
        return await this.redis.expire(key, seconds);
    }

    async ttl(key: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.ttl(key);
    }

    // Hash operations
    async hset(key: string, field: string, value: string): Promise<number>;
    async hset(
        key: string,
        fieldValueMap: Record<string, string>
    ): Promise<number>;
    async hset(
        key: string,
        fieldOrMap: string | Record<string, string>,
        value?: string
    ): Promise<number> {
        this.ensureConnected();
        if (typeof fieldOrMap === 'string' && value !== undefined) {
            return await this.redis.hset(key, fieldOrMap, value);
        } else if (typeof fieldOrMap === 'object') {
            return await this.redis.hset(key, fieldOrMap);
        }
        throw new Error('Invalid arguments for hset');
    }

    async hget(key: string, field: string): Promise<string | null> {
        this.ensureConnected();
        return await this.redis.hget(key, field);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        this.ensureConnected();
        return await this.redis.hgetall(key);
    }

    async hdel(key: string, ...fields: string[]): Promise<number> {
        this.ensureConnected();
        if (fields.length === 0) return 0;
        return await this.redis.hdel(key, ...fields);
    }

    async hexists(key: string, field: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.hexists(key, field);
    }

    async hincrby(
        key: string,
        field: string,
        increment: number
    ): Promise<number> {
        this.ensureConnected();
        return await this.redis.hincrby(key, field, increment);
    }

    // Counter operations
    async incr(key: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.incr(key);
    }

    async incrby(key: string, increment: number): Promise<number> {
        this.ensureConnected();
        return await this.redis.incrby(key, increment);
    }

    async decr(key: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.decr(key);
    }

    async decrby(key: string, decrement: number): Promise<number> {
        this.ensureConnected();
        return await this.redis.decrby(key, decrement);
    }

    // Sorted set operations (great for rate limiting with sliding windows)
    async zadd(key: string, score: number, member: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.zadd(key, score, member);
    }

    async zrem(key: string, ...members: string[]): Promise<number> {
        this.ensureConnected();
        if (members.length === 0) return 0;
        return await this.redis.zrem(key, ...members);
    }

    async zrange(key: string, start: number, stop: number): Promise<string[]> {
        this.ensureConnected();
        return await this.redis.zrange(key, start, stop);
    }

    async zrangebyscore(
        key: string,
        min: number | string,
        max: number | string
    ): Promise<string[]> {
        this.ensureConnected();
        return await this.redis.zrangebyscore(key, min, max);
    }

    async zremrangebyscore(
        key: string,
        min: number | string,
        max: number | string
    ): Promise<number> {
        this.ensureConnected();
        return await this.redis.zremrangebyscore(key, min, max);
    }

    async zcard(key: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.zcard(key);
    }

    async zcount(
        key: string,
        min: number | string,
        max: number | string
    ): Promise<number> {
        this.ensureConnected();
        return await this.redis.zcount(key, min, max);
    }

    // Set operations
    async sadd(key: string, ...members: string[]): Promise<number> {
        this.ensureConnected();
        if (members.length === 0) return 0;
        return await this.redis.sadd(key, ...members);
    }

    async srem(key: string, ...members: string[]): Promise<number> {
        this.ensureConnected();
        if (members.length === 0) return 0;
        return await this.redis.srem(key, ...members);
    }

    async smembers(key: string): Promise<string[]> {
        this.ensureConnected();
        return await this.redis.smembers(key);
    }

    async sismember(key: string, member: string): Promise<number> {
        this.ensureConnected();
        return await this.redis.sismember(key, member);
    }

    // Advanced operations
    async pipeline() {
        this.ensureConnected();
        return this.redis.pipeline();
    }

    async multi() {
        this.ensureConnected();
        return this.redis.multi();
    }

    async eval(
        script: string,
        numKeys: number,
        ...args: (string | number)[]
    ): Promise<any> {
        this.ensureConnected();
        return await this.redis.eval(script, numKeys, ...args);
    }

    // Utility methods for common patterns
    async setWithTTL(
        key: string,
        value: string,
        ttlSeconds: number
    ): Promise<'OK'> {
        this.ensureConnected();
        return await this.redis.setex(key, ttlSeconds, value);
    }

    async incrementWithTTL(
        key: string,
        ttlSeconds: number,
        increment: number = 1
    ): Promise<number> {
        this.ensureConnected();
        const pipeline = this.redis.pipeline();
        pipeline.incrby(key, increment);
        pipeline.expire(key, ttlSeconds);
        const results = await pipeline.exec();
        return results?.[0]?.[1] as number;
    }

    async getMultiple(keys: string[]): Promise<(string | null)[]> {
        this.ensureConnected();
        if (keys.length === 0) return [];
        return await this.redis.mget(...keys);
    }

    async setMultiple(keyValueMap: Record<string, string>): Promise<'OK'> {
        this.ensureConnected();
        const args: string[] = [];
        Object.entries(keyValueMap).forEach(([key, value]) => {
            args.push(key, value);
        });
        return await this.redis.mset(...args);
    }

    // Get raw Redis client for advanced operations
    getClient(): Redis {
        this.ensureConnected();
        return this.redis;
    }
}
