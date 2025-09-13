import { ClientSession, Document, PopulateOptions } from 'mongoose';
import { IPaginationOrder } from 'src/common/pagination/interfaces/pagination.interface';

export interface IDatabaseQueryContainOptions {
    fullWord: boolean;
}

export type IDatabaseDocument<T> = T & Document;

// Find
export interface IDatabaseOptions {
    select?: Record<string, boolean | number> | string;
    join?: boolean | PopulateOptions | PopulateOptions[];
    session?: ClientSession;
    upsert?: boolean;
    allowDiskUse?: boolean;
}

export type IDatabaseGetTotalOptions = Omit<IDatabaseOptions, 'select'>;

export interface IDatabaseFindAllPagingOptions {
    limit: number;
    offset: number;
}

export interface IDatabaseFindAllOptions extends IDatabaseOptions {
    paging?: IDatabaseFindAllPagingOptions;
    order?: IPaginationOrder;
}

export interface IDatabaseExistOptions extends IDatabaseOptions {
    excludeId?: string[];
}

// Action
export type IDatabaseCreateOptions = Pick<IDatabaseOptions, 'session'>;
export type IDatabaseUpdateOptions = Omit<IDatabaseOptions, 'select' | 'join'>;
export type IDatabaseDeleteOptions = Omit<IDatabaseOptions, 'select' | 'join'>;
export type IDatabaseSaveOptions = Pick<IDatabaseOptions, 'session'>;

// Bulk
export type IDatabaseCreateManyOptions = Pick<IDatabaseOptions, 'session'>;
export interface IDatabaseUpdateManyOptions
    extends Pick<IDatabaseOptions, 'session'> {
    upsert?: boolean;
}
export type IDatabaseDeleteManyOptions = Pick<IDatabaseOptions, 'session'>;

// Raw
export type IDatabaseAggregateOptions = Pick<
    IDatabaseOptions,
    'session' | 'allowDiskUse'
>;
export type IDatabaseFindAllAggregateOptions = Omit<
    IDatabaseFindAllOptions,
    'join' | 'select'
>;

export interface DatabaseEntityConstructor {
    new (...args: any[]): any;
    prototype: any;
}

export interface localizationFields {
    en?: string;
    ar?: string;
}
