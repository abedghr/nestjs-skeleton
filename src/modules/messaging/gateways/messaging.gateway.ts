import { AuthService } from './../../auth/services/auth.service';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagingService } from '../services/messaging.service';
import { ConversationService } from '../services/conversation.service';
import { UserStatusService } from '../services/user-status.service';
import { ENUM_MESSAGE_TYPE } from '../enums/messaging.enum';

@WebSocketGateway({
    namespace: '/messaging',
    cors: {
        origin: '*',
    },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(MessagingGateway.name);

    constructor(
        private readonly messagingService: MessagingService,
        private readonly conversationService: ConversationService,
        private readonly userStatusService: UserStatusService,
        private readonly AuthService: AuthService,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const userId = await this.extractUserIdFromSocket(client);
            if (!userId) {
                client.disconnect();
                return;
            }

            // Set user online
            await this.userStatusService.setUserOnline(userId, client.id);
            await this.userStatusService.updateLastSeen(userId);

            // Join user's personal room
            client.join(`user:${userId}`);
            client.data.userId = userId;

            // Broadcast user online status to all connected clients
            this.server.emit('user_online', { userId: userId });

            this.logger.log(`User ${userId} connected with socket ${client.id}`);
        } catch (error) {
            this.logger.error('Error handling connection:', error);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        try {
            const userId = client.data.userId;
            if (userId) {
                // Set user offline
                await this.userStatusService.setUserOffline(userId);
                await this.userStatusService.updateLastSeen(userId);

                // Broadcast user offline status to all connected clients
                this.server.emit('user_offline', { userId: userId });

                this.logger.log(`User ${userId} disconnected`);
            }
        } catch (error) {
            this.logger.error('Error handling disconnect:', error);
        }
    }

    @SubscribeMessage('join_conversation')
    async handleJoinConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string }
    ) {

        console.log("join_conversation", data);
        
        try {
            const userId = client.data.userId;
            if (!userId) return;

            // Verify user is participant
            const isParticipant = await this.conversationService.isUserInConversation(
                data.conversationId,
                userId
            );

            if (isParticipant) {
                client.join(`conversation:${data.conversationId}`);
                this.logger.log(`User ${userId} joined conversation ${data.conversationId}`);
            }
        } catch (error) {
            this.logger.error('Error joining conversation:', error);
        }
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: {
            conversationId: string;
            content: string;
            messageType?: ENUM_MESSAGE_TYPE;
            files?: Array<{
                fileUrl: string;
                fileName: string;
                fileSize: number;
                mimeType: string;
            }>;
        }
    ) {
        try {
            const userId = client.data.userId;
            if (!userId) return;

            // Send message
            const message = await this.messagingService.sendMessage({
                conversationId: data.conversationId,
                senderId: userId,
                content: data.content,
                messageType: data.messageType || ENUM_MESSAGE_TYPE.TEXT,
                files: data.files,
            });

            // Broadcast to conversation room
            this.server.to(`conversation:${data.conversationId}`).emit('new_message', {
                message: {
                    _id: message._id,
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    content: message.content,
                    messageType: message.messageType,
                    status: message.status,
                    files: message.files || [],
                    createdAt: new Date(),
                },
            });

            // // Also notify participants via their personal rooms, so receivers see
            // // the new conversation even if they haven't joined the conversation room yet
            // try {
            //     const participantIds = await this.conversationService.getConversationParticipants(message.conversationId);
            //     participantIds.filter((participantId) => !!participantId)
            //         .forEach((participantId) => {
            //             this.server.to(`user:${participantId}`).emit('new_message', {
            //                 message: {
            //                     _id: message._id,
            //                     conversationId: message.conversationId,
            //                     senderId: message.senderId,
            //                     content: message.content,
            //                     messageType: message.messageType,
            //                     status: message.status,
            //                     createdAt: new Date(),
            //                 },
            //             });
            //         });
            // } catch (notifyError) {
            //     this.logger.warn(`Failed notifying personal rooms for conversation ${message.conversationId}: ${notifyError?.message}`);
            // }

            this.logger.log(`Message sent in conversation ${data.conversationId}`);
        } catch (error) {
            this.logger.error('Error sending message:', error);
            client.emit('error', { message: 'Failed to send message' });
        }
    }

    // @SubscribeMessage('mark_read')
    // async handleMarkRead(
    //     @ConnectedSocket() client: Socket,
    //     @MessageBody() data: { messageId: string }
    // ) {
    //     try {
    //         const userId = client.data.userId;
    //         if (!userId) return;

    //         const message = await this.messagingService.markMessageAsRead(data.messageId, userId);

    //         // Broadcast read receipt
    //         this.server.to(`conversation:${message.conversationId}`).emit('message_read', {
    //             messageId: message._id,
    //             readBy: userId,
    //             readAt: new Date(),
    //         });
    //     } catch (error) {
    //         this.logger.error('Error marking message as read:', error);
    //     }
    // }

    // @SubscribeMessage('typing_start')
    // async handleTypingStart(
    //     @ConnectedSocket() client: Socket,
    //     @MessageBody() data: { conversationId: string }
    // ) {
    //     try {
    //         const userId = client.data.userId;
    //         if (!userId) return;

    //         // Broadcast typing start to conversation room (no database verification)
    //         this.server.to(`conversation:${data.conversationId}`).emit('typing_start', {
    //             conversationId: data.conversationId,
    //             userId: userId,
    //         });
            
    //         this.logger.log(`User ${userId} started typing in conversation ${data.conversationId}`);
    //     } catch (error) {
    //         this.logger.error('Error handling typing start:', error);
    //     }
    // }

    // @SubscribeMessage('typing_stop')
    // async handleTypingStop(
    //     @ConnectedSocket() client: Socket,
    //     @MessageBody() data: { conversationId: string }
    // ) {
    //     try {
    //         const userId = client.data.userId;
    //         if (!userId) return;

    //         // Broadcast typing stop to conversation room (no database verification)
    //         this.server.to(`conversation:${data.conversationId}`).emit('typing_stop', {
    //             conversationId: data.conversationId,
    //             userId: userId,
    //         });
            
    //         this.logger.log(`User ${userId} stopped typing in conversation ${data.conversationId}`);
    //     } catch (error) {
    //         this.logger.error('Error handling typing stop:', error);
    //     }
    // }

    private async extractUserIdFromSocket(client: Socket): Promise<string | null> {
        try {            
            // Extract user ID from JWT token in auth            
            const token = client.handshake.auth.token ?? client.handshake.headers.token;
            if (!token) {
                this.logger.warn('No token provided in handshake auth');
                return null;
            }

            // Remove 'Bearer ' prefix if present
            const accessToken = token.replace('Bearer ', '');
            
            const decoded = this.AuthService.payloadAccessToken(accessToken);
            return decoded._id;
        } catch (error) {
            this.logger.error('Error extracting user ID:', error);
            return null;
        }
    }
}
