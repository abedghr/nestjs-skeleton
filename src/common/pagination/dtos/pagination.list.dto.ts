import { ApiHideProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Allow } from 'class-validator';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { IPaginationOrder } from 'src/common/pagination/interfaces/pagination.interface';

export class PaginationListDto {
    //BEGIN Search props
    //####################################

    @Expose()
    @ApiHideProperty()
    _search: Record<string, any>;

    @Allow()
    @ApiHideProperty()
    search: string;

    @Allow()
    @ApiHideProperty()
    availableSearch: string[];
    
    //####################################
    //END Search props

    //BEGIN Filters props
    //####################################
    
    @Allow()
    @ApiHideProperty()
    filters: Record<
        string,
        string | number | boolean | Array<string | number | boolean>
    >;
    
    //####################################
    //END Filters props

    //BEGIN Limit props
    //####################################

    @Expose()
    @ApiHideProperty()
    _limit: number;
    
    @Allow()
    @ApiHideProperty()
    perPage: number;

    //####################################
    //END Limit props

    //BEGIN Offset props
    //####################################
    
    @Expose()
    @ApiHideProperty()
    _offset: number;

    @Allow()
    @ApiHideProperty()
    page: number;

    //####################################
    //END Offset props

    //BEGIN Order props
    //####################################

    @Expose()
    @ApiHideProperty()
    _order: IPaginationOrder;

    @Allow()
    @ApiHideProperty()
    orderBy: string;

    @Allow()
    @ApiHideProperty()
    orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;

    @Expose()
    @ApiHideProperty()
    _availableOrderBy: string[];
    
    @Allow()
    @ApiHideProperty()
    availableOrderBy: string[];

    @Expose()
    @ApiHideProperty()
    _availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];

    @Allow()
    @ApiHideProperty()
    availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
    
    //####################################
    //END Order props
}
