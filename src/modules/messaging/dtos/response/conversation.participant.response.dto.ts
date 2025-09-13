import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConversationParticipantResponseDto {
    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'User ID',
    })
    _id: string;

    @Expose()
    @ApiProperty({
        example: 'John',
        description: 'User first name',
    })
    firstName?: string;

    @Expose()
    @ApiProperty({
        example: 'Doe',
        description: 'User last name',
    })
    lastName?: string;

    @Expose()
    @ApiProperty({
        example: 'john@example.com',
        description: 'User email',
    })
    email?: string;

    @Expose()
    @ApiProperty({
        example: 'https://example.com/avatar.jpg',
        description: 'User avatar URL',
    })
    avatarUrl?: string;
}