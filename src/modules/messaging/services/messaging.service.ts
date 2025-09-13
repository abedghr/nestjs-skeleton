import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MessageRepository } from '../repository/repositories/message.repository';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { MessageDoc, MessageEntity } from '../repository/entities/message.entity';
import { ConversationDoc } from '../repository/entities/conversation.entity';
import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_STATUS } from '../enums/messaging.enum';
import { ConversationRepository } from '../repository/repositories/conversation.repository';
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/enums/pagination.enum';

@Injectable()
export class MessagingService {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly conversationRepository: ConversationRepository,
        private readonly paginationService: PaginationService
    ) {}

    // Send a message
    async sendMessage(data: {
        conversationId: string;
        senderId: string;
        content: string;
        messageType?: ENUM_MESSAGE_TYPE;
        files?: Array<{
            fileUrl: string;
            fileName: string;
            fileSize: number;
            mimeType: string;
        }>;
    }): Promise<MessageDoc> {
        // Verify conversation exists and user is participant
        const isParticipant = await this.conversationRepository.isParticipant(
            data.conversationId,
            data.senderId
        );

        if (!isParticipant) {
            throw new ForbiddenException('User is not a participant in this conversation');
        }

        // Create the message
        const messageData = new MessageEntity();
        messageData.createdAt = new Date();
        messageData.updatedAt = new Date();
        messageData.conversationId = data.conversationId;
        messageData.senderId = data.senderId;
        messageData.content = data.content;
        messageData.messageType = data.messageType || ENUM_MESSAGE_TYPE.TEXT;
        messageData.status = ENUM_MESSAGE_STATUS.SENT;
        messageData.files = data.files || [];
        messageData.readBy = [];

        const message = await this.messageRepository.create(messageData);

        // Update conversation's last message
        await this.conversationRepository.updateLastMessage(
            data.conversationId,
            {
                messageId: message._id.toString(),
                content: data.content.substring(0, 200),
                senderId: data.senderId,
                sentAt: new Date(),
            }
        );

        return message;
    }

    // Get messages for a conversation
    async getConversationMessages(
        conversationId: string,
        userId: string,
        options?: any
    ) {
        // Verify user is participant
        const isParticipant = await this.conversationRepository.isParticipant(
            conversationId,
            userId
        );

        if (!isParticipant) {
            throw new ForbiddenException('User is not a participant in this conversation');
        }

        

        const messages = await this.messageRepository.findByConversationId(
            conversationId,
            {...options, join: true}
        );

        const total = await this.messageRepository.countByConversationId(conversationId);
        const totalPages = this.paginationService.totalPage(total, options.perPage);

        return {
            data: messages,
            total,
            page: options.page,
            perPage: options.perPage,
            totalPages,
        };
    }

    // Mark message as read
    async markMessageAsRead(messageId: string, userId: string): Promise<MessageDoc> {
        const message = await this.messageRepository.findOneById(messageId);

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        // Verify user is participant in the conversation
        const isParticipant = await this.conversationRepository.isParticipant(
            message.conversationId,
            userId
        );

        if (!isParticipant) {
            throw new ForbiddenException('User is not a participant in this conversation');
        }

        // Don't mark own messages as read
        if (message.senderId === userId) {
            return message;
        }

        return this.messageRepository.markAsRead(messageId, userId);
    }

    // Mark all messages in conversation as read
    async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
        const isParticipant = await this.conversationRepository.isParticipant(
            conversationId,
            userId
        );

        if (!isParticipant) {
            throw new ForbiddenException('User is not a participant in this conversation');
        }

        await this.messageRepository.markConversationMessagesAsRead(conversationId, userId);
    }

    // Get user conversations
    async getUserConversations(
        userId: string,
        options: IDatabaseFindAllOptions & { page: number, perPage: number, orderBy: string, orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE }
    ){
        
        const conversations = await this.conversationRepository.findUserConversations(
            userId,
            options
        );        

        const total = await this.conversationRepository.countUserConversations(userId);

        return {
            data: conversations,
            total,
            page: options.page,
            perPage: options.perPage,
            totalPages: this.paginationService.totalPage(total, options.perPage),
        };
    }

    // Get conversation details
    async getConversation(conversationId: string, userId: string): Promise<ConversationDoc> {
        const conversation = await this.conversationRepository.findOneById(conversationId);

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        // Verify user is participant
        if (!conversation.participants.includes(userId)) {
            throw new ForbiddenException('User is not a participant in this conversation');
        }

        return conversation;
    }
}
