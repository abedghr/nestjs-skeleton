// src/common/rate-limit/decorators/rate-limit.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
    ENUM_RATE_LIMIT_TYPE,
    ENUM_RATE_LIMIT_WINDOW,
} from 'src/common/request/enums/rate-limit.enum';
import { RateLimitGuard } from 'src/common/request/guards/rate-limit.guard';
import {
    IRateLimitOptions,
    IRateLimitRule,
} from 'src/common/request/interfaces/rate-limit.interface';

export const RATE_LIMIT_KEY = 'rate_limit';

// Main decorator that follows your pattern
export function RateLimit(options: IRateLimitOptions): MethodDecorator {
    return applyDecorators(
        UseGuards(RateLimitGuard),
        SetMetadata(RATE_LIMIT_KEY, options)
    );
}

// Helper functions for common use cases
export function RateLimitIP(
    name: string,
    limits: IRateLimitRule[],
    message?: string
): MethodDecorator {
    return RateLimit({
        name,
        configs: [
            {
                type: ENUM_RATE_LIMIT_TYPE.IP,
                limits,
            },
        ],
        message,
    });
}

export function RateLimitUser(
    name: string,
    limits: IRateLimitRule[],
    message?: string
): MethodDecorator {
    return RateLimit({
        name,
        configs: [
            {
                type: ENUM_RATE_LIMIT_TYPE.USER,
                limits,
            },
        ],
        message,
    });
}

export function RateLimitBoth(
    name: string,
    ipLimits: IRateLimitRule[],
    userLimits: IRateLimitRule[],
    message?: string
): MethodDecorator {
    return RateLimit({
        name,
        configs: [
            {
                type: ENUM_RATE_LIMIT_TYPE.IP,
                limits: ipLimits,
            },
            {
                type: ENUM_RATE_LIMIT_TYPE.USER,
                limits: userLimits,
            },
        ],
        message,
    });
}

// Simple version that applies same limits to both IP and User
export function RateLimitBothSame(
    name: string,
    limits: IRateLimitRule[],
    message?: string
): MethodDecorator {
    return RateLimit({
        name,
        configs: [
            {
                type: ENUM_RATE_LIMIT_TYPE.IP,
                limits,
            },
            {
                type: ENUM_RATE_LIMIT_TYPE.USER,
                limits,
            },
        ],
        message,
    });
}

// Preset configurations for common scenarios
export function RateLimitDefault(): MethodDecorator {
    return RateLimitIP('default', [
        { window: ENUM_RATE_LIMIT_WINDOW.MINUTE, max: 20 },
        { window: ENUM_RATE_LIMIT_WINDOW.HOUR, max: 100 },
        { window: ENUM_RATE_LIMIT_WINDOW.DAY, max: 1000 },
    ]);
}

export function RateLimitStrict(): MethodDecorator {
    return RateLimitBoth(
        'strict',
        [
            { window: ENUM_RATE_LIMIT_WINDOW.MINUTE, max: 5 },
            { window: ENUM_RATE_LIMIT_WINDOW.HOUR, max: 50 },
            { window: ENUM_RATE_LIMIT_WINDOW.DAY, max: 200 },
        ],
        [
            { window: ENUM_RATE_LIMIT_WINDOW.MINUTE, max: 10 },
            { window: ENUM_RATE_LIMIT_WINDOW.HOUR, max: 100 },
            { window: ENUM_RATE_LIMIT_WINDOW.DAY, max: 500 },
        ]
    );
}

export function RateLimitAuth(): MethodDecorator {
    return RateLimitIP(
        'auth',
        [
            { window: ENUM_RATE_LIMIT_WINDOW.MINUTE, max: 3 },
            { window: ENUM_RATE_LIMIT_WINDOW.HOUR, max: 10 },
            { window: ENUM_RATE_LIMIT_WINDOW.DAY, max: 50 },
        ],
        'Too many authentication attempts'
    );
}
