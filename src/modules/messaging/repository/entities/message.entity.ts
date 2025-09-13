import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { ENUM_MESSAGE_STATUS, ENUM_MESSAGE_TYPE } from '../../enums/messaging.enum';

export const MessageTableName = 'messages';

@DatabaseEntity({ collection: MessageTableName })
export class MessageEntity extends DatabaseEntityAbstract {
    @DatabaseProp({
        type: String,
        required: true,
        ref: ConversationEntity.name,
    })
    conversationId: string;

    @DatabaseProp({
        type: String,
        required: true,
        ref: UserEntity.name,
    })
    senderId: string;

    @DatabaseProp({
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    })
    content: string;

    @DatabaseProp({
        type: String,
        enum: ENUM_MESSAGE_TYPE,
        default: ENUM_MESSAGE_TYPE.TEXT,
    })
    messageType: ENUM_MESSAGE_TYPE;

    @DatabaseProp({
        type: String,
        enum: ENUM_MESSAGE_STATUS,
        default: ENUM_MESSAGE_STATUS.SENT,
    })
    status: ENUM_MESSAGE_STATUS;

    @DatabaseProp({
        type: [{
            fileUrl: String,
            fileName: String,
            fileSize: Number,
            mimeType: String,
        }],
        default: [],
    })
    files?: Array<{
        fileUrl: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
    }>;

    @DatabaseProp({
        type: [{
            userId: String,
            readAt: Date,
        }],
        default: [],
    })
    readBy: Array<{
        userId: string;
        readAt: Date;
    }>;
}

export const MessageSchema = DatabaseSchema(MessageEntity);
// Use getFilter() to remove `__t` field from conditions
MessageSchema.pre(
    [
        'find',
        'findOne',
        'findOneAndUpdate',
        'findOneAndDelete',
        'countDocuments',
    ],
    function (next) {
        const filter = this.getFilter();
        if (filter.__t) {
            delete filter.__t;
        }
        next();
    }
);

export type MessageDoc = IDatabaseDocument<MessageEntity>;
