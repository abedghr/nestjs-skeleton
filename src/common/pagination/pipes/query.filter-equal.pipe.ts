import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import {
    ArgumentMetadata,
    PipeTransform,
    Scope,
} from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export function QueryFilterEqualPipe(): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinQueryFilterEqualPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(
            value: string,
            { data: field }: ArgumentMetadata
        ): Promise<Record<string, string | number>> {
            if (!value) {
                return undefined;
            }

            const finalValue: string | number = value;

            this.request.__filters = {
                ...this.request.__filters,
                [field]: finalValue,
            };

            return this.paginationService.filterEqual<string | number>(
                field,
                finalValue
            );
        }
    }

    return mixin(MixinQueryFilterEqualPipe);
}
