import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export function PaginationTextSearchPipe(
    availableTextSearch: string[] = []
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationTextSearchPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(
            value: Record<string, any>
        ): Promise<Record<string, any>> {
            if (availableTextSearch.length === 0 || !value?.textSearch) {
                this.addToRequestInstance(value?.textSearch);
                return value;
            }

            const textSearch: Record<string, any> =
                this.paginationService.textSearch(
                    value?.textSearch,
                    availableTextSearch
                );

            this.addToRequestInstance(value?.textSearch);
            return {
                ...value,
                _textSearch: textSearch,
                _availableSearch: availableTextSearch,
            };
        }

        addToRequestInstance(textSearch: string): void {
            this.request.__pagination = {
                ...this.request.__pagination,
                textSearch,
                availableTextSearch,
            };
        }
    }

    return mixin(MixinPaginationTextSearchPipe);
}
