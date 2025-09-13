import { ENUM_GEO_LOCATION_TYPE } from 'src/common/database/constants/generale.enum';
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
export class LocationEntity {
    @DatabaseProp({
        required: true,
        type: String,
        enum: ENUM_GEO_LOCATION_TYPE,
    })
    type: string;

    @DatabaseProp({
        required: true,
        type: [Number],
    })
    coordinates: number[];
}

export const LocationSchema = DatabaseSchema(LocationEntity);
export type LocationDoc = IDatabaseDocument<LocationEntity>;
