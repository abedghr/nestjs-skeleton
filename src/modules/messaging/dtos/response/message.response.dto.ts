import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MessageFileResponseDto } from './message.file.response.dto';
import { ENUM_MESSAGE_STATUS, ENUM_MESSAGE_TYPE } from '../../enums/messaging.enum';
import { MessageReadByResponseDto } from './message.read-by.response.dto';

export class MessageResponseDto {
    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Message ID',
    })
    _id: string;

    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Conversation ID',
    })
    conversationId: string;

    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Message sender ID',
    })
    senderId: string;

    @Expose()
    @ApiProperty({
        example: 'Hello! How are you?',
        description: 'Message content',
    })
    content: string;

    @Expose()
    @ApiProperty({
        enum: ENUM_MESSAGE_TYPE,
        example: ENUM_MESSAGE_TYPE.TEXT,
        description: 'Message type',
    })
    messageType: ENUM_MESSAGE_TYPE;

    @Expose()
    @ApiProperty({
        enum: ENUM_MESSAGE_STATUS,
        example: ENUM_MESSAGE_STATUS.SENT,
        description: 'Message status',
    })
    status: ENUM_MESSAGE_STATUS;

    @Expose()
    @ApiProperty({
        type: [MessageReadByResponseDto],
        description: 'Users who have read this message',
    })
    @Type(() => MessageReadByResponseDto)
    readBy: MessageReadByResponseDto[];

    @Expose()
    @ApiProperty({
        example: 'https://example.com/file.jpg',
        description: 'File URL (for file messages)',
        required: false,
    })
    fileUrl?: string;

    @Expose()
    @ApiProperty({
        example: 'image.jpg',
        description: 'File name (for file messages)',
        required: false,
    })
    fileName?: string;

    @Expose()
    @ApiProperty({
        example: 1024,
        description: 'File size in bytes (for file messages)',
        required: false,
    })
    fileSize?: number;

    @Expose()
    @ApiProperty({
        type: [MessageFileResponseDto],
        description: 'Files in message',
    })
    @Type(() => MessageFileResponseDto)
    files?: MessageFileResponseDto[];

    @Expose()
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Creation timestamp',
    })
    @Transform(({ value }) => value.toISOString())
    createdAt: string;

    @Expose()
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Last update timestamp',
    })
    @Transform(({ value }) => value.toISOString())
    updatedAt: string;
}
