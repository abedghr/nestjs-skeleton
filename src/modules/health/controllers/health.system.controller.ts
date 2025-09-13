import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { HealthResponseDto } from 'src/modules/health/dtos/response/health.response.dto';
import { HealthAwsS3Indicator } from 'src/modules/health/indicators/health.aws-s3.indicator';
import { HealthSystemCheckDoc } from 'src/modules/health/docs/health.system.doc';
import { HealthFirebaseIndicator } from 'src/modules/health/indicators/health.firebase.indicator';
import { HealthAwsSESIndicator } from 'src/modules/health/indicators/health.aws-ses.indicator';
import { HealthRedisIndicator } from 'src/modules/health/indicators/health.redis.indicator';
import { RateLimit } from 'src/common/request/decorators/rate-limit.decorator';
import {
    ENUM_RATE_LIMIT_TYPE,
    ENUM_RATE_LIMIT_WINDOW,
} from 'src/common/request/enums/rate-limit.enum';

@ApiTags('modules.system.health')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthSystemController {
    constructor(
        @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly health: HealthCheckService,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        private readonly mongooseIndicator: MongooseHealthIndicator,
        private readonly awsS3Indicator: HealthAwsS3Indicator,
        private readonly awsSesIndicator: HealthAwsSESIndicator,
        private readonly firebaseIndicator: HealthFirebaseIndicator,
        private readonly redisIndicator: HealthRedisIndicator
    ) {}

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/aws')
    async checkAws(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () => this.awsS3Indicator.isHealthy('awsS3Bucket'),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/aws/ses')
    async checkAwsSes(): Promise<IResponse<HealthResponseDto>> {
        console.log('checkAwsSes');
        const data = await this.health.check([
            () => this.awsSesIndicator.isHealthy('awsSesTemplate'),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/firebase')
    async checkFirebase(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () => this.firebaseIndicator.isHealthy(),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/database')
    async checkDatabase(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () =>
                this.mongooseIndicator.pingCheck('database', {
                    connection: this.databaseConnection,
                }),
        ]);
        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @RateLimit({
        name: 'redis-health-check',
        configs: [
            {
                type: ENUM_RATE_LIMIT_TYPE.IP,
                limits: [
                    { window: ENUM_RATE_LIMIT_WINDOW.MINUTE, max: 120 },
                    { window: ENUM_RATE_LIMIT_WINDOW.HOUR, max: 600 },
                    { window: ENUM_RATE_LIMIT_WINDOW.DAY, max: 1200 },
                ],
            },
            {
                type: ENUM_RATE_LIMIT_TYPE.USER,
                limits: [
                    { window: ENUM_RATE_LIMIT_WINDOW.MINUTE, max: 120 },
                    { window: ENUM_RATE_LIMIT_WINDOW.HOUR, max: 600 },
                    { window: ENUM_RATE_LIMIT_WINDOW.DAY, max: 1200 },
                ],
            },
        ],
    })
    @Get('/redis')
    async checkRedis(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () => this.redisIndicator.isHealthy(),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/memory-heap')
    async checkMemoryHeap(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkHeap(
                    'memoryHeap',
                    300 * 1024 * 1024
                ),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/memory-rss')
    async checkMemoryRss(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () =>
                this.memoryHealthIndicator.checkRSS(
                    'memoryRss',
                    300 * 1024 * 1024
                ),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }

    @HealthSystemCheckDoc()
    @Response('health.check')
    @HealthCheck()
    @Get('/storage')
    async checkStorage(): Promise<IResponse<HealthResponseDto>> {
        const data = await this.health.check([
            () =>
                this.diskHealthIndicator.checkStorage('diskHealth', {
                    thresholdPercent: 0.75,
                    path: '/',
                }),
        ]);

        return {
            data: data as HealthResponseDto,
        };
    }
}
