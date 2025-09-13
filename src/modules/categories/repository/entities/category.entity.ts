import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import {
    LocalizationEntity,
    LocalizationSchema,
} from 'src/common/database/repository/entities/localization.entity';
import {
    validateLocalizationFields,
    ValidateLocalizations,
} from 'src/common/database/validators/localization.validator';
import { ENUM_CATEGORY_STATUS } from 'src/modules/categories/constants/category.enum';

export const CategoryTableName = 'categories';

@DatabaseEntity({ collection: CategoryTableName })
@ValidateLocalizations(['name'])
export class CategoryEntity extends DatabaseEntityAbstract {
    @DatabaseProp({
        required: true,
        type: Object,
        schema: LocalizationSchema,
    })
    name: LocalizationEntity;

    @DatabaseProp({
        required: true,
        default: ENUM_CATEGORY_STATUS.INACTIVE,
        index: true,
        type: String,
        enum: ENUM_CATEGORY_STATUS,
    })
    status: ENUM_CATEGORY_STATUS;

    @DatabaseProp({
        required: true,
        default: 0,
        type: Number,
    })
    order: number;
}

export const CategorySchema = DatabaseSchema(CategoryEntity);
validateLocalizationFields(CategorySchema, ['name']);
export type CategoryDoc = IDatabaseDocument<CategoryEntity>;
