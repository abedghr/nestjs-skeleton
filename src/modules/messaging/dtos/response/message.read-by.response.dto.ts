import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class MessageReadByResponseDto {
    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'User ID who read the message',
    })
    userId: string;

    @Expose()
    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Read timestamp',
    })
    @Transform(({ value }) => value.toISOString())
    readAt: string;
}