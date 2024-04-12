import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Optional,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { DebuggerService } from 'src/common/debugger/services/debugger.service';
import { ERROR_TYPE } from 'src/common/error/constants/error.enum.constant';
import {
    IErrorException,
    IErrors,
    IErrorsImport,
    IValidationErrorImport,
} from 'src/common/error/interfaces/error.interface';
import { ErrorMetadataSerialization } from 'src/common/error/serializations/error.serialization';
import {
    IMessage,
    IMessageOptionsProperties,
} from 'src/common/message/interfaces/message.interface';
import { MessageService } from 'src/common/message/services/message.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

// If we throw error with HttpException, there will always return object
// The exception filter only catch HttpException
@Catch()
export class ErrorHttpFilter implements ExceptionFilter {
    constructor(
        @Optional() private readonly debuggerService: DebuggerService,
        private readonly configService: ConfigService,
        private readonly messageService: MessageService,
    ) {}

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request: IRequestApp = ctx.getRequest<IRequestApp>();

        // get request headers
        const __customLang: string[] = request.__customLang ?? [
            this.messageService.getLanguage(),
        ];
        const __path = request.path;
        const __version =
            request.__version ??
            this.configService.get<string>('app.versioning.version');
        const __repoVersion =
            request.__repoVersion ??
            this.configService.get<string>('app.repoVersion');

        // Debugger
        try {
            this.debuggerService.error(
                ErrorHttpFilter.name,
                {
                    description:
                        exception instanceof Error
                            ? exception.message
                            : exception.toString(),
                    class: ErrorHttpFilter.name,
                    function: this.catch.name,
                    path: __path,
                },
                exception
            );
        } catch (err: unknown) {
            console.log(err); 
        }

        // set default
        let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let messagePath = `http.${statusHttp}`;
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let _error: string = undefined;
        let errors: IErrors[] | IErrorsImport[] = undefined;
        let messageProperties: IMessageOptionsProperties = undefined;
        let data: Record<string, any> = undefined;
        let metadata: ErrorMetadataSerialization = {
            languages: __customLang,
            path: __path,
            version: __version,
            repoVersion: __repoVersion,
        };
        if (exception instanceof HttpException) {
            // Restructure
            const responseException = exception.getResponse();
            statusHttp = exception.getStatus();
            messagePath = `http.${statusHttp}`;
            statusCode = exception.getStatus();

            if (this.isErrorException(responseException)) {
                const { _metadata } = responseException;

                statusCode = responseException.statusCode;
                messagePath = responseException.message;
                data = responseException.data;
                messageProperties =
                    _metadata?.customProperty?.messageProperties;
                delete _metadata?.customProperty;

                metadata = {
                    ...metadata,
                    ..._metadata,
                };

                if (responseException.errors?.length > 0) {
                    errors =
                        responseException._errorType === ERROR_TYPE.IMPORT
                            ? this.messageService.getImportErrorsMessage(
                                  responseException.errors as IValidationErrorImport[],
                                  { customLanguages: __customLang }
                              )
                            : this.messageService.getRequestErrorsMessage(
                                  responseException.errors as ValidationError[],
                                  { customLanguages: __customLang }
                              );
                }

                if (!responseException._error) {
                    _error =
                        typeof responseException._error !== 'string'
                            ? JSON.stringify(responseException._error)
                            : responseException._error;
                }
            }
        }

        const message: string | IMessage = await this.messageService.get(
            messagePath,
            {
                customLanguages: __customLang,
                properties: messageProperties,
            }
        );

        const responseBody = {
            statusCode,
            message,
            errors,
            _error,
            _metadata: metadata,
            data,
        };

        response
            .setHeader('x-custom-lang', __customLang)
            .setHeader('x-version', __version)
            .setHeader('x-repo-version', __repoVersion)
            .status(statusHttp)
            .json(responseBody);

        return;
    }

    isErrorException(obj: any): obj is IErrorException {
        return typeof obj === 'object'
            ? 'statusCode' in obj && 'message' in obj
            : false;
    }
}
