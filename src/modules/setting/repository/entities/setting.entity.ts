import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import {
    ENUM_SETTING_DATA_TYPE,
    ENUM_SETTING_NAME,
} from 'src/modules/setting/enums/setting.enum';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';

export const SettingTableName = 'settings';

@DatabaseEntity({ collection: SettingTableName })
export class SettingEntity extends DatabaseEntityAbstract {
    @DatabaseProp({
        required: true,
        unique: true,
        index: true,
        trim: true,
        type: String,
        enum: ENUM_SETTING_NAME,
    })
    name: ENUM_SETTING_NAME;

    @DatabaseProp({
        required: false,
        type: String,
    })
    description?: string;

    @DatabaseProp({
        required: false,
        type: String,
        enum: ENUM_SETTING_DATA_TYPE,
    })
    type: ENUM_SETTING_DATA_TYPE;

    @DatabaseProp({
        required: true,
        trim: true,
        type: String,
    })
    value: string;

    @DatabaseProp({
        required: true,
        trim: true,
        default: 'system',
        type: String,
    })
    code: string;
}

export const SettingSchema = DatabaseSchema(SettingEntity);
SettingSchema.index(
    {
        code: 1,
        name: 1,
    },
    { unique: true }
);
export type SettingDoc = IDatabaseDocument<SettingEntity>;
