import { IsDefined } from 'class-validator';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';

@DatabaseEntity({
    _id: false,
    timestamps: false,
})
export class LocalizationEntity {
    @IsDefined({ message: 'English translation must be defined' })
    @DatabaseProp({
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    })
    en: string;

    @DatabaseProp({
        type: String,
        required: false,
        trim: true,
        minlength: 3,
    })
    ar?: string;
}

export const LocalizationSchema = DatabaseSchema(LocalizationEntity);
export type LocalizationDoc = IDatabaseDocument<LocalizationEntity>;
