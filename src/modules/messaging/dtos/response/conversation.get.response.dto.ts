import { ApiProperty } from '@nestjs/swagger';
import { ENUM_CONVERSATION_TYPE } from 'src/modules/messaging/enums/messaging.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { ConversationParticipantResponseDto } from './conversation.participant.response.dto';
import { ConversationLastMessageResponseDto } from './conversation.last-message.response.dto';

export class ConversationGetResponseDto {
    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Conversation ID',
    })
    _id: string;

    @Expose()
    @ApiProperty({
        type: [ConversationParticipantResponseDto],
        description: 'Conversation participants',
    })
    participants: ConversationParticipantResponseDto[];

    @Expose()
    @ApiProperty({
        enum: ENUM_CONVERSATION_TYPE,
        example: ENUM_CONVERSATION_TYPE.DIRECT,
        description: 'Conversation type',
    })
    type: ENUM_CONVERSATION_TYPE;

    @Expose()
    @ApiProperty({
        type: ConversationLastMessageResponseDto,
        required: false,
        description: 'Last message in conversation',
    })
    @Type(() => ConversationLastMessageResponseDto)
    lastMessage?: ConversationLastMessageResponseDto;

    @Expose()
    @ApiProperty({
        example: 10,
        description: 'Total message count',
    })
    messageCount: number;

    @Expose()
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Last update timestamp',
    })
    @Transform(({ value }) => value.toISOString())
    updatedAt: string;

    @Expose()
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Creation timestamp',
    })
    @Transform(({ value }) => value.toISOString())
    createdAt: string;
}
