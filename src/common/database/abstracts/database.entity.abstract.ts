import { DatabaseProp } from 'src/common/database/decorators/database.decorator';
import { v6 as uuidV6 } from 'uuid';

export abstract class DatabaseEntityAbstract {
    @DatabaseProp({
        type: String,
        default: uuidV6,
    })
    _id: string;

    @DatabaseProp({
        required: false,
        index: 'asc',
        type: Date,
        default: () => new Date(),
    })
    createdAt?: Date;

    @DatabaseProp({
        required: false,
        index: true,
    })
    createdBy?: string;

    @DatabaseProp({
        required: false,
        index: 'asc',
        type: Date,
        default: () => new Date(),
    })
    updatedAt?: Date;

    @DatabaseProp({
        required: false,
        index: true,
    })
    updatedBy?: string;
}
