import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseEntity } from 'src/common/database/mongo/decorators/database.decorator';
import { GEO_LOCATION_TYPE } from '../constants/database.enum.constants';
import { DatabaseMongoObjectIdEntityAbstract } from '../database.mongo.object-id.entity.abstract';
import { IDatabaseLocationField } from '../interfaces/database.mongo.interface';

export const LocationDatabaseName = 'locations';

@DatabaseEntity({ collection: LocationDatabaseName })
export class LocationEntity extends DatabaseMongoObjectIdEntityAbstract {

    @Prop({
        required: false,
        trim: true,
        type: String,
        maxlength: 100,
    })
    name?: string;

    @Prop({
        required: false,
        trim: true,
        type: String,
        maxlength: 300,
    })
    description?: string;

    @Prop({
        type: {
            type: String,
            enum: GEO_LOCATION_TYPE,
            default: GEO_LOCATION_TYPE.POINT,
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    })
    location: IDatabaseLocationField;
}

export const LocationSchema = SchemaFactory.createForClass(LocationEntity);
