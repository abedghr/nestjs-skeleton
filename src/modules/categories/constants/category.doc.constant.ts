import { ENUM_CATEGORY_STATUS } from 'src/modules/categories/constants/category.enum';

export const CategoryDocParamsId = [
    {
        name: 'category',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        description: 'category id',
    },
];

export const CategoryDocQueryStatus = [
    {
        name: 'status',
        allowEmptyValue: true,
        required: false,
        type: 'string',
        example: Object.values(ENUM_CATEGORY_STATUS).join(','),
        description: "value with ',' delimiter",
    },
];

export const HomeCategoryDocParamsId = [
    {
        name: 'homeCategory',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        description: 'home category id',
    },
];
