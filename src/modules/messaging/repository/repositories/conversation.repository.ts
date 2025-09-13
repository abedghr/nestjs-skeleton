import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConversationDoc, ConversationEntity } from '../entities/conversation.entity';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ENUM_CONVERSATION_TYPE } from '../../enums/messaging.enum';
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';


@Injectable()
export class ConversationRepository extends DatabaseRepositoryAbstract<
    ConversationEntity,
    ConversationDoc
> {
    constructor(
        @DatabaseModel(ConversationEntity.name)
        private readonly conversationModel: Model<ConversationEntity>
    ) {
        super(conversationModel, [
            {
                path: 'participants',
            }
        ]);
    }

    async findUserConversations(
        userId: string,
        options: IDatabaseFindAllOptions
    ): Promise<ConversationDoc[]> {
        return this.findAll({
            participants: userId,
        }, {...options, join: true});
    }

    async countUserConversations(userId: string): Promise<number> {
        return this.conversationModel
            .countDocuments({
                participants: userId,
            })
            .exec();
    }

    async updateLastMessage(
        conversationId: string,
        lastMessage: {
            messageId: string;
            content: string;
            senderId: string;
            sentAt: Date;
        }
    ): Promise<ConversationDoc> {
        return this.conversationModel
            .findByIdAndUpdate(
                conversationId,
                {
                    lastMessage,
                    $inc: { messageCount: 1 },
                },
                { new: true }
            )
            .exec();
    }

    async isParticipant(conversationId: string, userId: string): Promise<boolean> {
        const conversation = await this.conversationModel
            .findById(conversationId)
            .select('participants')
            .exec();
        
        return conversation?.participants.includes(userId) || false;
    }

    async findDirectConversation(userId1: string, userId2: string): Promise<ConversationDoc | null> {
        const participants = [userId1, userId2].sort();
        return this.conversationModel.findOne({
            participants: { $all: participants, $size: 2 },
            type: ENUM_CONVERSATION_TYPE.DIRECT,
        }).exec();
    }

    async populateConversation(conversation: ConversationDoc): Promise<ConversationDoc> {
        return this.conversationModel
            .findById(conversation._id)
            .populate('participants', 'firstName lastName email avatarUrl username')
            .populate('lastMessage')
            .exec();
    }
}