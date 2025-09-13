import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import { DatabaseEntity, DatabaseProp, DatabaseSchema } from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { ENUM_CONVERSATION_TYPE } from 'src/modules/messaging/enums/messaging.enum';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';


export const ConversationTableName = 'conversations';

@DatabaseEntity({ collection: ConversationTableName })
export class ConversationEntity extends DatabaseEntityAbstract {
    @DatabaseProp({
        type: [String],
        ref: UserEntity.name,
        required: true,
        validate: {
            validator: function(participants: string[]) {
                return participants.length === 2;
            },
            message: 'Direct conversations must have exactly 2 participants',
        },
    })
    participants: string[];

    @DatabaseProp({
        type: String,
        enum: ENUM_CONVERSATION_TYPE,
        default: ENUM_CONVERSATION_TYPE.DIRECT,
    })
    type: ENUM_CONVERSATION_TYPE;

    @DatabaseProp({
        type: Number,
        default: 0,
    })
    messageCount: number;

    @DatabaseProp({
        type: {
            messageId: String,
            content: String,
            senderId: String,
            sentAt: Date,
        },
    })
    lastMessage?: {
        messageId: string;
        content: string;
        senderId: string;
        sentAt: Date;
    };
}

export const ConversationSchema = DatabaseSchema(ConversationEntity);
// Use getFilter() to remove `__t` field from conditions
ConversationSchema.pre(
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
export type ConversationDoc = IDatabaseDocument<ConversationEntity>;
