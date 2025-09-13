import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ConversationLastMessageResponseDto {
    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Message ID',
    })
    messageId: string;

    @Expose()
    @ApiProperty({
        example: 'Hello! How are you?',
        description: 'Message content',
    })
    content: string;

    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Sender user ID',
    })
    senderId: string;

    @Expose()
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Message sent timestamp',
    })
    @Transform(({ value }) => value.toISOString())
    sentAt: Date;
}