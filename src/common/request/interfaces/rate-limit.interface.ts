import {
    ENUM_RATE_LIMIT_TYPE,
    ENUM_RATE_LIMIT_WINDOW,
} from 'src/common/request/enums/rate-limit.enum';

export interface IRateLimitRule {
    window: ENUM_RATE_LIMIT_WINDOW;
    max: number;
    windowMs?: number; // Override default window duration if needed
}

export interface IRateLimitTypeConfig {
    type: ENUM_RATE_LIMIT_TYPE;
    limits: IRateLimitRule[];
}

export interface IRateLimitOptions {
    name: string;
    configs: IRateLimitTypeConfig[]; // Array of configurations for each type
    message?: string; // Custom error message
}

export interface IRateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    totalHits: number;
    limit: number;
    window: string;
}
