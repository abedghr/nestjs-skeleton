import { Prop } from '@nestjs/mongoose';
import { DatabaseDefaultUUID } from '../constants/database.function.constant';
import { DATABASE_CREATED_AT_FIELD_NAME, DATABASE_DELETED_AT_FIELD_NAME, DATABASE_UPDATED_AT_FIELD_NAME } from '../constants/database.constant';
import { DatabaseBaseEntityAbstract } from '../database.base-entity.abstract';

export abstract class DatabaseMongoUUIDEntityAbstract extends DatabaseBaseEntityAbstract<string> {
    @Prop({
        type: String,
        default: DatabaseDefaultUUID,
    })
    _id: string;

    @Prop({
        required: false,
        type: Date,
    })
    [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

    @Prop({
        required: false,
        type: Date,
    })
    [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

    @Prop({
        required: false,
        type: Date,
    })
    [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
