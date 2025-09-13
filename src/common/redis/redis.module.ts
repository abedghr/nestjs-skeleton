// src/common/redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';

@Global()
@Module({
    exports: [RedisService],
    providers: [RedisService],
    imports: [],
    controllers: [],
})
export class RedisModule {}
