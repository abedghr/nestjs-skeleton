import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/common/redis/services/redis.service';
import {
    IRateLimitOptions,
    IRateLimitResult,
    IRateLimitRule,
    IRateLimitTypeConfig,
} from '../interfaces/rate-limit.interface';
import {
    ENUM_RATE_LIMIT_TYPE,
    ENUM_RATE_LIMIT_WINDOW,
} from 'src/common/request/enums/rate-limit.enum';

@Injectable()
export class RateLimitService {
    private readonly logger = new Logger(RateLimitService.name);

    constructor(private readonly redisService: RedisService) {}

    async checkRateLimit(
        ip: string,
        userId: string | null,
        options: IRateLimitOptions
    ): Promise<{
        allowed: boolean;
        results: Record<string, IRateLimitResult[]>;
        notAllowedTypes: Array<ENUM_RATE_LIMIT_TYPE>;
    }> {
        const results: Record<string, IRateLimitResult[]> = {};
        let overallAllowed = true;
        const notAllowedTypes: Array<ENUM_RATE_LIMIT_TYPE> = [];

        // Check each type configuration
        for (const config of options.configs) {
            let identifier: string;
            let baseKey: string;

            if (config.type === ENUM_RATE_LIMIT_TYPE.IP) {
                identifier = ip;
                baseKey = `rate_limit:ip:${options.name}:${ip}`;
            } else if (
                config.type === ENUM_RATE_LIMIT_TYPE.USER &&
                userId != null
            ) {
                identifier = userId;
                baseKey = `rate_limit:user:${options.name}:${userId}`;
            } else {
                continue;
            }

            try {
                const typeResults = await this.checkLimitsForType(
                    baseKey,
                    config
                );
                results[config.type] = typeResults;

                // If any limit is exceeded, overall is not allowed
                if (typeResults.some(result => !result.allowed)) {
                    overallAllowed = false;
                }

                // get from any type the not allowed came
                if (!overallAllowed) {
                    if (
                        config.type === ENUM_RATE_LIMIT_TYPE.IP &&
                        typeResults.some(result => !result.allowed)
                    ) {
                        notAllowedTypes.push(ENUM_RATE_LIMIT_TYPE.IP);
                    } else if (
                        config.type === ENUM_RATE_LIMIT_TYPE.USER &&
                        typeResults.some(result => !result.allowed)
                    ) {
                        notAllowedTypes.push(ENUM_RATE_LIMIT_TYPE.USER);
                    }
                }
            } catch (error) {
                this.logger.error(
                    `Rate limit check failed for ${config.type}:${identifier}:`,
                    error
                );
                // Fail open - allow if Redis fails
                results[config.type] = config.limits.map(limit => ({
                    allowed: true,
                    remaining: limit.max,
                    resetTime:
                        Date.now() +
                        this.getWindowMs(limit.window, limit.windowMs),
                    totalHits: 0,
                    limit: limit.max,
                    window: limit.window,
                }));
            }
        }

        return { allowed: overallAllowed, results, notAllowedTypes };
    }

    // private async checkLimitsForType(
    //     baseKey: string,
    //     config: IRateLimitTypeConfig
    // ): Promise<IRateLimitResult[]> {
    //     const results: IRateLimitResult[] = [];

    //     // Check each limit rule for this type
    //     for (const limit of config.limits) {
    //         try {
    //             const result = await this.checkSingleLimit(baseKey, limit);
    //             results.push(result);
    //         } catch (error) {
    //             this.logger.error(
    //                 `Rate limit check failed for ${baseKey}:${limit.window}:`,
    //                 error
    //             );
    //             // Fail open for this specific limit
    //             results.push({
    //                 allowed: true,
    //                 remaining: limit.max,
    //                 resetTime:
    //                     Date.now() +
    //                     this.getWindowMs(limit.window, limit.windowMs),
    //                 totalHits: 0,
    //                 limit: limit.max,
    //                 window: limit.window,
    //             });
    //         }
    //     }

    //     return results;
    // }

    private async checkLimitsForType(
        baseKey: string,
        config: IRateLimitTypeConfig
    ): Promise<IRateLimitResult[]> {
        const results: IRateLimitResult[] = [];
        let anyLimitExceeded = false;

        // First pass: Check all limits WITHOUT incrementing
        for (const limit of config.limits) {
            try {
                const result = await this.checkSingleLimitDryRun(
                    baseKey,
                    limit
                );
                results.push(result);

                if (!result.allowed) {
                    anyLimitExceeded = true;
                }
            } catch (error) {
                this.logger.error(
                    `Rate limit check failed for ${baseKey}:${limit.window}:`,
                    error
                );
                // Fail open for this specific limit
                results.push({
                    allowed: true,
                    remaining: limit.max,
                    resetTime:
                        Date.now() +
                        this.getWindowMs(limit.window, limit.windowMs),
                    totalHits: 0,
                    limit: limit.max,
                    window: limit.window,
                });
            }
        }

        // Second pass: Only increment if ALL limits are allowed
        if (!anyLimitExceeded) {
            for (let i = 0; i < config.limits.length; i++) {
                const limit = config.limits[i];
                try {
                    await this.incrementLimitCounter(baseKey, limit);
                    // Update the result to reflect the increment
                    results[i].totalHits += 1;
                    results[i].remaining = Math.max(
                        0,
                        results[i].remaining - 1
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to increment counter for ${baseKey}:${limit.window}:`,
                        error
                    );
                }
            }
        }

        return results;
    }

    // Check limit without incrementing
    private async checkSingleLimitDryRun(
        baseKey: string,
        limit: IRateLimitRule
    ): Promise<IRateLimitResult> {
        const now = Math.floor(Date.now() / 1000);
        const windowMs = this.getWindowMs(limit.window, limit.windowMs);
        const windowSeconds = Math.floor(windowMs / 1000);
        const windowStart = now - windowSeconds;
        const key = `${baseKey}:${limit.window}`;

        // Clean up old entries and count current ones
        const pipeline = await this.redisService.pipeline();
        pipeline.zremrangebyscore(key, '-inf', windowStart);
        pipeline.zcard(key);

        const results = await pipeline.exec();

        if (!results || results.some(([err]) => err)) {
            throw new Error('Pipeline execution failed');
        }

        const currentCount = results[1][1] as number;
        const wouldBeCount = currentCount + 1; // What count would be if we added this request
        const allowed = wouldBeCount <= limit.max;
        const remaining = Math.max(0, limit.max - wouldBeCount);
        const resetTime = (now + windowSeconds) * 1000;

        this.logger.log(
            `Dry run check - Key: ${key}, Current: ${currentCount}, Would be: ${wouldBeCount}, Allowed: ${allowed}`
        );

        return {
            allowed,
            remaining,
            resetTime,
            totalHits: wouldBeCount,
            limit: limit.max,
            window: limit.window,
        };
    }

    // Only increment the counter (called after all checks pass)
    private async incrementLimitCounter(
        baseKey: string,
        limit: IRateLimitRule
    ): Promise<void> {
        const now = Math.floor(Date.now() / 1000);
        const windowMs = this.getWindowMs(limit.window, limit.windowMs);
        const windowSeconds = Math.floor(windowMs / 1000);
        const key = `${baseKey}:${limit.window}`;

        const requestId = `${now}-${Math.random()}`;
        await this.redisService.zadd(key, now, requestId);
        await this.redisService.expire(key, windowSeconds);
    }

    private getWindowMs(
        window: ENUM_RATE_LIMIT_WINDOW,
        customMs?: number
    ): number {
        if (customMs) {
            return customMs;
        }

        switch (window) {
            case ENUM_RATE_LIMIT_WINDOW.MINUTE:
                return 60 * 1000;
            case ENUM_RATE_LIMIT_WINDOW.HOUR:
                return 60 * 60 * 1000;
            case ENUM_RATE_LIMIT_WINDOW.DAY:
                return 24 * 60 * 60 * 1000;
            case ENUM_RATE_LIMIT_WINDOW.WEEK:
                return 7 * 24 * 60 * 60 * 1000;
            case ENUM_RATE_LIMIT_WINDOW.MONTH:
                return 30 * 24 * 60 * 60 * 1000; // 30 days
            default:
                return 60 * 60 * 1000; // Default to 1 hour
        }
    }

    async resetRateLimit(ip?: string, userId?: string): Promise<void> {
        try {
            const patterns: string[] = [];

            if (ip) {
                patterns.push(`rate_limit:ip:${ip}:*`);
            }

            if (userId) {
                patterns.push(`rate_limit:user:${userId}:*`);
            }

            for (const pattern of patterns) {
                const keys = await this.redisService.getClient().keys(pattern);
                if (keys.length > 0) {
                    await this.redisService.del(...keys);
                }
            }
        } catch (error) {
            this.logger.error('Failed to reset rate limit:', error);
        }
    }
}
