import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageFileResponseDto {
    @Expose()
    @ApiProperty({
        example: 'https://example.com/file.jpg',
        description: 'Message file URL',
    })
    fileUrl: string;

    @Expose()
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Message file name',
    })
    fileName: string;

    @Expose()
    @ApiProperty({
        example: 1024,
        description: 'Message file size',
    })
    fileSize: number;

    @Expose()
    @ApiProperty({
        example: 'image/jpeg',
        description: 'Message file mime type',
    })
    mimeType: string;
}
