import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const PAGINATION_PER_PAGE = 25;
export const PAGINATION_MAX_PER_PAGE = 100;
export const PAGINATION_PAGE = 1;
export const PAGINATION_MAX_PAGE = 100;
export const PAGINATION_ORDER_BY = 'createdAt';
export const PAGINATION_ORDER_DIRECTION: ENUM_PAGINATION_ORDER_DIRECTION_TYPE =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const PAGINATION_AVAILABLE_ORDER_BY: string[] = ['createdAt'];
export const PAGINATION_AVAILABLE_ORDER_DIRECTION: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[] =
    Object.values(ENUM_PAGINATION_ORDER_DIRECTION_TYPE);
