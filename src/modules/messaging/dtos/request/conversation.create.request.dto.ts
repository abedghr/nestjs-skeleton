import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConversationCreateRequestDto {
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Other user ID to create conversation with',
    })
    @IsString()
    @IsNotEmpty()
    otherUserId: string;
}
