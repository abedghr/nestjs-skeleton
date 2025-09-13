// src/common/rate-limit/guards/rate-limit.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RateLimitService } from '../services/rate-limit.service';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';
import {
    IRateLimitOptions,
    IRateLimitResult,
} from '../interfaces/rate-limit.interface';
import { ENUM_RATE_LIMIT_TYPE } from '../enums/rate-limit.enum';

@Injectable()
export class RateLimitGuard implements CanActivate {
    private readonly logger = new Logger(RateLimitGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly rateLimitService: RateLimitService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const options = this.reflector.get<IRateLimitOptions>(
            RATE_LIMIT_KEY,
            context.getHandler()
        );

        if (!options) {
            return true; // No rate limiting configured
        }

        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        try {
            const ip = this.getClientIP(request);
            const userId = this.getUserId(request);

            const { allowed, results, notAllowedTypes } =
                await this.rateLimitService.checkRateLimit(ip, userId, options);

            // Set rate limit headers
            this.setRateLimitHeaders(response, results);

            if (!allowed) {
                const message =
                    options.message || `${options.name}: Rate limit exceeded`;

                this.logger.warn(
                    `${options.name}: Rate limit exceeded for ${notAllowedTypes.join(', ')}`
                );

                // Get retry after from the most restrictive limit
                const retryAfter = this.getRetryAfter(results);
                if (retryAfter) {
                    response.setHeader('Retry-After', retryAfter);
                }

                throw new HttpException(
                    {
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        message,
                        error: 'Too Many Requests',
                    },
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }

            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(
                `${options.name}: Rate limit check failed:`,
                error
            );
            // Fail open - allow request if rate limiting fails
            return true;
        }
    }

    private getClientIP(request: Request): string {
        const forwarded = request.headers['x-forwarded-for'];
        const realIp = request.headers['x-real-ip'];

        const ip = forwarded
            ? Array.isArray(forwarded)
                ? forwarded[0]
                : forwarded.split(',')[0]
            : realIp || request.socket.remoteAddress || request.ip;

        return Array.isArray(ip) ? ip[0] : ip || 'unknown';
    }

    private getUserId(request: Request): string | null {
        const user = request.user as any;

        if (user) {
            return user.id || user._id || user.userId || user.sub || null;
        }

        return null;
    }

    private setRateLimitHeaders(
        response: Response,
        results: Record<string, IRateLimitResult[]>
    ): void {
        // Find the most restrictive result across all types and windows
        let mostRestrictive: IRateLimitResult | null = null;
        let minRemaining = Infinity;

        for (const [, typeResults] of Object.entries(results)) {
            for (const result of typeResults) {
                if (result.remaining < minRemaining) {
                    minRemaining = result.remaining;
                    mostRestrictive = result;
                }
            }
        }

        if (mostRestrictive) {
            response.setHeader('X-RateLimit-Limit', mostRestrictive.limit);
            response.setHeader(
                'X-RateLimit-Remaining',
                mostRestrictive.remaining
            );
            response.setHeader(
                'X-RateLimit-Reset',
                Math.ceil(mostRestrictive.resetTime / 1000)
            );
            response.setHeader('X-RateLimit-Window', mostRestrictive.window);
        }

        // Add type-specific headers for debugging
        if (results[ENUM_RATE_LIMIT_TYPE.IP]) {
            const ipResults = results[ENUM_RATE_LIMIT_TYPE.IP];
            const minIpRemaining = Math.min(...ipResults.map(r => r.remaining));
            response.setHeader('X-RateLimit-IP-Remaining', minIpRemaining);
        }

        if (results[ENUM_RATE_LIMIT_TYPE.USER]) {
            const userResults = results[ENUM_RATE_LIMIT_TYPE.USER];
            const minUserRemaining = Math.min(
                ...userResults.map(r => r.remaining)
            );
            response.setHeader('X-RateLimit-User-Remaining', minUserRemaining);
        }
    }

    private getRetryAfter(
        results: Record<string, IRateLimitResult[]>
    ): number | null {
        let maxRetryAfter = 0;

        for (const [, typeResults] of Object.entries(results)) {
            for (const result of typeResults) {
                if (!result.allowed) {
                    const retryAfter = Math.ceil(
                        (result.resetTime - Date.now()) / 1000
                    );
                    maxRetryAfter = Math.max(maxRetryAfter, retryAfter);
                }
            }
        }

        return maxRetryAfter > 0 ? maxRetryAfter : null;
    }
}
