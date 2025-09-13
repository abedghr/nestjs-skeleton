import { Injectable } from '@nestjs/common';
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from 'src/common/redis/services/redis.service';

@Injectable()
export class HealthRedisIndicator extends HealthIndicator {
    constructor(private readonly redisService: RedisService) {
        super();
    }

    isHealthy(): HealthIndicatorResult {
        try {
            this.redisService.isHealthy();
            return this.getStatus('redis', true);
        } catch (err: any) {
            throw new HealthCheckError(
                `HealthRedisIndicator Failed - ${err?.message}`,
                this.getStatus('redis', false)
            );
        }
    }
}
