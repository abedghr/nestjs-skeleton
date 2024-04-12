import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorHttpFilter } from './filters/error.http.filter';
import { ErrorMetaGuard } from './guards/error.meta.guard';

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ErrorHttpFilter, // used to handle the errors
        },
        {
            provide: APP_GUARD,
            useClass: ErrorMetaGuard, // used to set the class & function names in the request.
        },
    ],
    imports: [],
})
export class ErrorModule {}
