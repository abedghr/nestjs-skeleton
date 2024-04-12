import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
    HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import ms from 'ms';
import {
    REQUEST_CUSTOM_TIMEOUT_META_KEY,
    REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from 'src/common/request/constants/request.constant';

@Injectable()
export class RequestTimeoutInterceptor
    implements NestInterceptor<Promise<any>>
{
    private readonly maxTimeoutInSecond: number;

    constructor(
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) {
        this.maxTimeoutInSecond =
            this.configService.get<number>('request.timeout');
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'http') {
            const customTimeout = this.reflector.get<boolean>(
                REQUEST_CUSTOM_TIMEOUT_META_KEY,
                context.getHandler()
            );

            if (customTimeout) {
                const seconds: string = this.reflector.get<string>(
                    REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
                    context.getHandler()
                );

                return next.handle().pipe(
                    timeout(ms(seconds)),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException({
                                statusCode: HttpStatus.REQUEST_TIMEOUT,
                                message: 'http.clientError.requestTimeOut',
                            });
                        }
                        return throwError(() => err);
                    })
                );
            } else {
                return next.handle().pipe(
                    timeout(this.maxTimeoutInSecond),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException({
                                statusCode: HttpStatus.REQUEST_TIMEOUT,
                                message: 'http.clientError.requestTimeOut',
                            });
                        }
                        return throwError(() => err);
                    })
                );
            }
        }

        return next.handle();
    }
}
