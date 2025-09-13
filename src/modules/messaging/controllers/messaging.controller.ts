import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { AuthJwtAccessProtected } from 'src/modules/auth/decorators/auth.jwt.decorator';
import { AuthJwtPayload } from 'src/modules/auth/decorators/auth.jwt.decorator';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { Response, ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { RequestRequiredPipe } from 'src/common/request/pipes/request.required.pipe';
import { AwsS3Service } from 'src/modules/aws/services/aws.s3.service';
import { MessagingService } from '../services/messaging.service';
import { ConversationService } from '../services/conversation.service';
import { UserStatusService } from '../services/user-status.service';
import { ConversationCreateRequestDto } from '../dtos/request/conversation.create.request.dto';
import { MessageSendRequestDto } from '../dtos/request/message.send.request.dto';
import { ConversationListResponseDto } from '../dtos/response/conversation.list.response.dto';
import { ConversationGetResponseDto } from '../dtos/response/conversation.get.response.dto';
import { MessageListResponseDto } from '../dtos/response/message.list.response.dto';
import { ConversationAdminCreateDoc, ConversationAdminGetDoc, ConversationAdminGetMessagesDoc, ConversationAdminSendMessageDoc, UserConversationsDoc } from '../docs/messaging.doc';

@ApiTags('modules.messaging')
@Controller({
    version: '1',
    path: '/messaging',
})
export class MessagingController {
    constructor(
        private readonly messagingService: MessagingService,
        private readonly conversationService: ConversationService,
        private readonly userStatusService: UserStatusService,
        private readonly paginationService: PaginationService,
        private readonly awsS3Service: AwsS3Service
    ) {}

    @UserConversationsDoc()
    @ResponsePaging('messaging.conversation.list', {
        serialization: ConversationListResponseDto,
    })
    @AuthJwtAccessProtected()
    @Get('/conversations')
    async getUserConversations(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @PaginationQuery()
        { _limit, _offset, _order }: PaginationListDto
    ) {
        const conversations = await this.messagingService.getUserConversations(
            user._id,
            {
                page: _offset,
                perPage: _limit,
                orderBy: _order.orderBy,
                orderDirection: _order.orderDirection,
                join: true,
            }
        );


        const total = conversations.total;
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: conversations.data.map(conversation => ({
                _id: conversation._id,
                participants: conversation.participants,
                type: conversation.type,
                lastMessage: conversation.lastMessage ? {
                    messageId: conversation.lastMessage.messageId,
                    content: conversation.lastMessage.content,
                    senderId: conversation.lastMessage.senderId,
                    sentAt: conversation.lastMessage.sentAt,
                } : undefined,
                messageCount: conversation.messageCount,
                updatedAt: conversation.updatedAt,
                createdAt: conversation.createdAt,
            })),
        };
    }

    @ConversationAdminCreateDoc()
    @Response('messaging.conversation.create', {
        serialization: ConversationGetResponseDto,
    })
    @AuthJwtAccessProtected()
    @Post('/conversations')
    @HttpCode(HttpStatus.CREATED)
    async createConversation(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @Body() createConversationDto: ConversationCreateRequestDto
    ) {
        const conversation = await this.conversationService.findOrCreateDirectConversation(
            user._id,
            createConversationDto.otherUserId
        );

        return {
            data: {
                _id: conversation._id,
                participants: conversation.participants,
                type: conversation.type,
                lastMessage: conversation.lastMessage ? {
                    messageId: conversation.lastMessage.messageId,
                    content: conversation.lastMessage.content,
                    senderId: conversation.lastMessage.senderId,
                    sentAt: conversation.lastMessage.sentAt,
                } : undefined,
                messageCount: conversation.messageCount,
                updatedAt: conversation.updatedAt,
                createdAt: conversation.createdAt,
            },
        };
    }

    @ConversationAdminGetDoc()
    @Response('messaging.conversation.get', {
        serialization: ConversationGetResponseDto,
    })
    @AuthJwtAccessProtected()
    @Get('/conversations/:conversationId')
    async getConversation(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @Param('conversationId', RequestRequiredPipe) conversationId: string
    ) {
        const conversation = await this.messagingService.getConversation(
            conversationId,
            user._id
        );

        return {
            data: {
                _id: conversation._id,
                participants: conversation.participants,
                type: conversation.type,
                lastMessage: conversation.lastMessage,
                messageCount: conversation.messageCount,
                updatedAt: conversation.updatedAt,
                createdAt: conversation.createdAt,
            },
        };
    }

    @ConversationAdminGetMessagesDoc()
    @ResponsePaging('messaging.message.list', {
        serialization: MessageListResponseDto,
    })
    @AuthJwtAccessProtected()
    @Get('/conversations/:conversationId/messages')
    async getConversationMessages(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @Param('conversationId', RequestRequiredPipe) conversationId: string,
        @PaginationQuery()
        { _limit, _offset, _order }: PaginationListDto
    ) {
        const messages = await this.messagingService.getConversationMessages(
            conversationId,
            user._id,
            {
                page: _offset,
                perPage: _limit,
                orderBy: _order.orderBy,
                orderDirection: _order.orderDirection,
            }
        );

        const total = messages.total;
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: messages.data.map(message => ({
                _id: message._id,
                conversationId: message.conversationId,
                senderId: message.senderId,
                content: message.content,
                messageType: message.messageType,
                status: message.status,
                readBy: message.readBy || [],
                files: message.files || [],
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            })),
        };
    }

    @ConversationAdminSendMessageDoc()
    @Response('messaging.message.send')
    @AuthJwtAccessProtected()
    @Post('/conversations/:conversationId/messages')
    @HttpCode(HttpStatus.CREATED)
    async sendMessage(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @Param('conversationId', RequestRequiredPipe) conversationId: string,
        @Body() sendMessageDto: MessageSendRequestDto
    ) {
        const message = await this.messagingService.sendMessage({
            conversationId,
            senderId: user._id,
            content: sendMessageDto.content,
            messageType: sendMessageDto.messageType,
            files: sendMessageDto.files,
        });

        return {
            data: message,
        };
    }

    @Response('messaging.conversation.markRead')
    @AuthJwtAccessProtected()
    @Put('/conversations/:conversationId/read')
    @HttpCode(HttpStatus.OK)
    async markConversationAsRead(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @Param('conversationId', RequestRequiredPipe) conversationId: string
    ) {
        await this.messagingService.markConversationAsRead(conversationId, user._id);
        return { data: { success: true } };
    }


    @Response('messaging.files.upload')
    @AuthJwtAccessProtected()
    @Post('/conversations/:conversationId/upload-files')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
    @ApiConsumes('multipart/form-data')
    async uploadFiles(
        @AuthJwtPayload() user: AuthJwtAccessPayloadDto,
        @Param('conversationId', RequestRequiredPipe) conversationId: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        console.log("files", files);
        console.log("user", user);
        
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        if (files.length > 10) {
            throw new BadRequestException('Maximum 10 files allowed');
        }

        // Verify user is participant in the conversation
        const conversation = await this.messagingService.getConversation(conversationId, user._id);
        if (!conversation) {
            throw new BadRequestException('Conversation not found or access denied');
        }

        // Validate all files first
        const maxSize = 10 * 1024 * 1024; // 10MB per file
        const allowedMimeTypes = [
            // Images
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            // Documents
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            // Videos
            'video/mp4',
            'video/quicktime',
            'video/avi',
            'video/webm',
            'video/mov',
            'video/wmv',
            'video/flv',
            'video/mkv',
            // Audio
            'audio/mpeg',
            'audio/wav',
            'audio/mp3',
            'audio/aac',
            'audio/ogg',
        ];

        // Validate each file
        for (const file of files) {
            if (file.size > maxSize) {
                throw new BadRequestException(`File ${file.originalname} exceeds 10MB limit`);
            }

            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new BadRequestException(`File type not supported for ${file.originalname}`);
            }
        }

        // Upload all files to S3
        const uploadPromises = files.map(async (file) => {
            const uploadResult = await this.awsS3Service.putItemInBucketWithAcl(
                {
                    originalname: file.originalname,
                    buffer: file.buffer,
                    size: file.size,
                },
                {
                    path: `messaging/files/${conversationId}`,
                    customFilename: `${Date.now()}-${user._id}-${Math.random().toString(36).substring(2)}`,
                }
            );

            return {
                fileUrl: uploadResult.completedUrl,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
            };
        });

        const uploadResults = await Promise.all(uploadPromises);

        return {
            data: uploadResults,
        };
    }
}
