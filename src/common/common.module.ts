import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { DatabaseModule } from 'src/common/database/database.module';
import { DatabaseService } from 'src/common/database/services/database.service';
import { MessageModule } from 'src/common/message/message.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { RequestModule } from 'src/common/request/request.module';
import { PolicyModule } from 'src/modules/policy/policy.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from 'src/configs';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { FileModule } from 'src/common/file/file.module';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { ResponseModule } from 'src/common/response/response.module';
import { BullModule } from '@nestjs/bullmq';
import { WORKER_CONNECTION_NAME } from 'src/worker/constants/worker.constant';

@Module({
    controllers: [],
    providers: [],
    imports: [
        // Config
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: false,
        }),
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            imports: [DatabaseModule],
            inject: [DatabaseService],
            useFactory: (databaseService: DatabaseService) =>
                databaseService.createOptions(),
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    name: WORKER_CONNECTION_NAME,
                    host: configService.get<string>('redis.queue.host'),
                    port: configService.get<number>('redis.queue.port'),
                    username: configService.get<string>('redis.queue.username'),
                    password: configService.get<string>('redis.queue.password'),
                    tls: configService.get<any>('redis.queue.tls'),
                },
                defaultJobOptions: {
                    backoff: {
                        type: 'exponential',
                        delay: 3000,
                    },
                    attempts: 3,
                },
            }),
        }),
        CacheModule.registerAsync<RedisClientOptions>({
            imports: [ConfigModule],
            inject: [ConfigService],
            isGlobal: true,
            useFactory: async (configService: ConfigService) => ({
                store: (await redisStore({
                    socket: {
                        host: configService.get<string>('redis.cache.host'),
                        port: configService.get<number>('redis.cache.port'),
                        tls: configService.get<any>('redis.cache.tls'),
                    },
                    username: configService.get<string>('redis.cache.username'),
                    password: configService.get<string>('redis.cache.password'),
                    ttl: configService.get<number>('redis.cache.ttl'),
                })) as unknown as CacheStore,
            }),
        }),
        MessageModule.forRoot(),
        HelperModule.forRoot(),
        RequestModule.forRoot(),
        PolicyModule.forRoot(),
        AuthModule.forRoot(),
        PaginationModule.forRoot(),
        FileModule.forRoot(),
        ResponseModule,
    ],
})
export class CommonModule {}
