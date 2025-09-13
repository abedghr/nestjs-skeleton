import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../repository/repositories/conversation.repository';
import { ConversationDoc, ConversationEntity } from '../repository/entities/conversation.entity';
import { ENUM_CONVERSATION_TYPE } from '../enums/messaging.enum';

@Injectable()
export class ConversationService {
    constructor(
        private readonly conversationRepository: ConversationRepository
    ) {}

    async findOrCreateDirectConversation(
        userId1: string,
        userId2: string
    ): Promise<ConversationDoc> {
        // Check if conversation already exists
        const existingConversation = await this.conversationRepository.findDirectConversation(
            userId1,
            userId2
        );

        if (existingConversation) {
            // Populate participants for existing conversation
            return this.conversationRepository.populateConversation(existingConversation);
        }

        // Create new conversation
        const participants = [userId1, userId2].sort();
       
        const conversation = new ConversationEntity();
        conversation.participants = participants;
        conversation.type = ENUM_CONVERSATION_TYPE.DIRECT;
        conversation.messageCount = 0;

        const createdConversation = await this.conversationRepository.create(conversation);
        
        // Populate participants for new conversation
        return this.conversationRepository.populateConversation(createdConversation);
    }

    async getConversation(conversationId: string): Promise<ConversationDoc> {
        const conversation = await this.conversationRepository.findOneById(conversationId);
        
        if (!conversation) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'conversation.error.notFound',
                _error: "Conversation not found",
            });
        }

        return conversation;
    }

    async isUserInConversation(conversationId: string, userId: string): Promise<boolean> {
        return this.conversationRepository.isParticipant(conversationId, userId);
    }

    async getConversationParticipants(conversationId: string, excludeUserId?: string){
        const conversation = await this.getConversation(conversationId);
        
        if (excludeUserId) {
            return conversation.participants.filter(id => id !== excludeUserId);
        }
        
        return conversation.participants;
    }
}