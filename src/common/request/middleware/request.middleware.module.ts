import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestCorsMiddleware } from 'src/common/request/middleware/cors/request.cors.middleware';
import { RequestHelmetMiddleware } from 'src/common/request/middleware/helmet/request.helmet.middleware';
import { RequestVersionMiddleware } from 'src/common/request/middleware/version/request.version.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                RequestHelmetMiddleware,
                RequestCorsMiddleware,
                RequestVersionMiddleware,
            )
            .forRoutes('*');
    }
}
