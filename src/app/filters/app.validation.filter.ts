import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IAppException } from 'src/app/interfaces/app.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { IMessageValidationError } from 'src/common/message/interfaces/message.interface';
import { MessageService } from 'src/common/message/services/message.service';
import { RequestValidationException } from 'src/common/request/exceptions/request.validation.exception';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ResponseMetadataDto } from 'src/common/response/dtos/response.dto';

@Catch(RequestValidationException)
export class AppValidationFilter implements ExceptionFilter {
    private readonly debug: boolean;
    private readonly logger = new Logger(AppValidationFilter.name);

    constructor(
        private readonly messageService: MessageService,
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService
    ) {
        this.debug = this.configService.get<boolean>('app.debug');
    }

    async catch(
        exception: RequestValidationException,
        host: ArgumentsHost
    ): Promise<void> {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request: IRequestApp = ctx.getRequest<IRequestApp>();

        if (this.debug) {
            this.logger.error(exception);
        }

        // metadata
        const xLanguage: string =
            request.__language ?? this.messageService.getLanguage();
        const xTimestamp = this.helperDateService.createTimestamp();
        const currentDay = new Date().getDay();
        const metadata: ResponseMetadataDto = {
            language: xLanguage,
            timestamp: xTimestamp,
            path: request.path,
            currentDayNumber: currentDay,
            currentDay: currentDay.toString(),
        };

        // set response
        const message = this.messageService.setMessage(exception.message, {
            customLanguage: xLanguage,
        });
        const errors: IMessageValidationError[] =
            this.messageService.setValidationMessage(exception.errors, {
                customLanguage: xLanguage,
            });

        const responseBody: IAppException = {
            statusCode: exception.statusCode,
            message,
            errors,
            _metadata: metadata,
        };

        response
            .setHeader('x-custom-lang', xLanguage)
            .setHeader('x-timestamp', xTimestamp)
            .status(exception.httpStatus)
            .json(responseBody);

        return;
    }
}
