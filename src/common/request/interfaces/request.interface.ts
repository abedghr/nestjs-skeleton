import { Request } from 'express';
import { RequestPaginationSerialization } from 'src/common/request/serializations/request.pagination.serialization';

export interface IRequestApp extends Request {
    user?: Record<string, any>;

    __customLang: string[];
    __xCustomLang: string;
    __version: string;
    __repoVersion: string;

    __filters?: Record<
        string,
        string | number | boolean | Array<string | number | boolean>
    >;
    __pagination?: RequestPaginationSerialization;
}
