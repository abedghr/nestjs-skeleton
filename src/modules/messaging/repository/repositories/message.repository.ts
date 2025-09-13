import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MessageDoc, MessageEntity } from '../entities/message.entity';
import { ENUM_MESSAGE_STATUS } from 'src/modules/messaging/enums/messaging.enum';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';

@Injectable()
export class MessageRepository extends DatabaseRepositoryAbstract<
    MessageEntity,
    MessageDoc
> {
    constructor(
        @DatabaseModel(MessageEntity.name)
        private readonly messageModel: Model<MessageEntity>
    ) {
        super(messageModel, []);
    }

    async getLastMessage(conversationId: string): Promise<MessageDoc | null> {
        return this.messageModel
            .findOne({
                conversationId,
            })
            .sort({ createdAt: -1 })
            .exec();
    }

    async markConversationMessagesAsRead(
        conversationId: string,
        userId: string,
        readAt: Date = new Date()
    ): Promise<void> {
        await this.messageModel
            .updateMany(
                {
                    conversationId,
                    senderId: { $ne: userId },
                    'readBy.userId': { $ne: userId },
                },
                {
                    $push: {
                        readBy: { userId, readAt },
                    },
                    $set: {
                        status: ENUM_MESSAGE_STATUS.READ,
                    },
                }
            )
            .exec();
    }

    async markAsRead(
        messageId: string,
        userId: string,
        readAt: Date = new Date()
    ): Promise<MessageDoc> {
        return this.messageModel
            .findOneAndUpdate(
                {
                    _id: messageId,
                    'readBy.userId': { $ne: userId },
                },
                {
                    $push: {
                        readBy: { userId, readAt },
                    },
                    $set: {
                        status: ENUM_MESSAGE_STATUS.READ,
                    },
                },
                { new: true }
            )
            .exec();
    }

    async findByConversationId(
        conversationId: string,
        options: IDatabaseFindAllOptions
    ): Promise<MessageDoc[]> {
        return this.findAll({
                conversationId,
        }, {...options, join: true});
    }

    async countByConversationId(conversationId: string): Promise<number> {
        return this.getTotal({
            conversationId,
        });
    }

    async findUnreadMessages(
        conversationId: string,
        userId: string
    ): Promise<MessageDoc[]> {
        return this.messageModel
            .find({
                conversationId,
                senderId: { $ne: userId },
                'readBy.userId': { $ne: userId },
            })
            .sort({ createdAt: 1 })
            .exec();
    }
}
