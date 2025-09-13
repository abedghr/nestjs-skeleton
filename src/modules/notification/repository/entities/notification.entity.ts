import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { ENUM_FIREBASE_TOPICS } from 'src/modules/firebase/constants/firebase.enum';

export const NotificationTableName = 'notifications';

@DatabaseEntity({ collection: NotificationTableName })
export class NotificationEntity extends DatabaseEntityAbstract {
    @DatabaseProp({ required: true, type: String, trim: true, maxlength: 255 })
    title: string;

    @DatabaseProp({ required: true, type: String, trim: true })
    body: string;

    @DatabaseProp({ required: true, enum: ENUM_FIREBASE_TOPICS })
    topic: ENUM_FIREBASE_TOPICS;

    @DatabaseProp({
        type: String,
        required: false,
        trim: true,
    })
    redirectUrl: string;

    @DatabaseProp({ type: Object, default: {} })
    data: Record<string, any>;

    @DatabaseProp({ type: Date, default: Date.now })
    createdAt: Date;

    @DatabaseProp({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const NotificationSchema = DatabaseSchema(NotificationEntity);
export type NotificationDoc = IDatabaseDocument<NotificationEntity>;
