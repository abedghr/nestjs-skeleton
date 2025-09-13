import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { MessageService } from 'src/common/message/services/message.service';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { IMessageOptionsProperties } from 'src/common/message/interfaces/message.interface';
import {
    RESPONSE_MESSAGE_PATH_META_KEY,
    RESPONSE_MESSAGE_PROPERTIES_META_KEY,
    RESPONSE_SERIALIZATION_META_KEY,
    RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from 'src/common/response/constants/response.constant';
import { IResponsePaging } from 'src/common/response/interfaces/response.interface';
import {
    ResponsePagingDto,
    ResponsePagingMetadataDto,
} from 'src/common/response/dtos/response.paging.dto';
import { ConfigService } from '@nestjs/config';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import {
    ClassConstructor,
    ClassTransformOptions,
    plainToInstance,
} from 'class-transformer';
import { ResponseService } from 'src/common/response/services/response.service';

@Injectable()
export class ResponsePagingInterceptor<T>
    implements NestInterceptor<Promise<ResponsePagingDto & T>>
{
    constructor(
        private readonly reflector: Reflector,
        private readonly messageService: MessageService,
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService,
        private readonly responseService: ResponseService
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Promise<ResponsePagingDto>> {
        if (context.getType() === 'http') {
            return next.handle().pipe(
                map(async (res: Promise<IResponsePaging<any>>) => {
                    const ctx: HttpArgumentsHost = context.switchToHttp();
                    const response: Response = ctx.getResponse();
                    const request: IRequestApp = ctx.getRequest<IRequestApp>();

                    let messagePath: string = this.reflector.get<string>(
                        RESPONSE_MESSAGE_PATH_META_KEY,
                        context.getHandler()
                    );
                    let messageProperties: IMessageOptionsProperties =
                        this.reflector.get<IMessageOptionsProperties>(
                            RESPONSE_MESSAGE_PROPERTIES_META_KEY,
                            context.getHandler()
                        );

                    const classSerialization: ClassConstructor<any> =
                        this.reflector.get<ClassConstructor<any>>(
                            RESPONSE_SERIALIZATION_META_KEY,
                            context.getHandler()
                        );

                    const classSerializationOptions: ClassTransformOptions =
                        this.reflector.get<ClassTransformOptions>(
                            RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
                            context.getHandler()
                        );

                    let httpStatus: HttpStatus = response.statusCode;
                    let statusCode: number = response.statusCode;
                    let data: Record<string, any>[] = [];
                    const currentDay = new Date().getDay();

                    // metadata
                    const xPath = request.path;
                    const xPagination = request.__pagination;
                    const xLanguage: string =
                        request.__language ?? this.messageService.getLanguage();
                    const xTimestamp = this.helperDateService.createTimestamp();
                    let metadata: ResponsePagingMetadataDto = {
                        language: xLanguage,
                        timestamp: xTimestamp,
                        path: xPath,
                        currentDayNumber: currentDay,
                        currentDay: currentDay.toString(),
                    };

                    // response
                    const responseData = (await res) as IResponsePaging<any>;
                    if (!responseData) {
                        throw new Error(
                            'ResponsePaging must instanceof IResponsePaging'
                        );
                    } else if (
                        !responseData.data ||
                        !Array.isArray(responseData.data)
                    ) {
                        throw new Error(
                            'Field data must in array and can not be empty'
                        );
                    }

                    const { _metadata } = responseData;

                    data = responseData.data;
                    if (classSerialization) {
                        data = plainToInstance(classSerialization, data, {
                            ...classSerializationOptions,
                            ...{ excludeExtraneousValues: true },
                        });
                        data = this.responseService.transformLocalizedFields(
                            data,
                            xLanguage
                        );
                    }
                    httpStatus =
                        _metadata?.customProperty?.httpStatus ?? httpStatus;
                    statusCode =
                        _metadata?.customProperty?.statusCode ?? statusCode;
                    messagePath =
                        _metadata?.customProperty?.message ?? messagePath;
                    messageProperties =
                        _metadata?.customProperty?.messageProperties ??
                        messageProperties;
                    metadata.currency =
                        _metadata?.customProperty?.currency ?? null;
                    metadata.vat = _metadata?.customProperty?.vat ?? null;

                    delete _metadata?.customProperty;

                    // metadata pagination
                    metadata = {
                        ...metadata,
                        ..._metadata,
                        pagination: {
                            ...xPagination,
                            ...responseData._pagination,
                        },
                    };

                    const message: string = this.messageService.setMessage(
                        messagePath,
                        {
                            customLanguage: xLanguage,
                            properties: messageProperties,
                        }
                    );

                    response.setHeader('x-custom-lang', xLanguage);
                    response.setHeader('x-timestamp', xTimestamp);
                    response.status(httpStatus);

                    return {
                        statusCode,
                        message,
                        _metadata: metadata,
                        data,
                    };
                })
            );
        }

        return next.handle();
    }
}
