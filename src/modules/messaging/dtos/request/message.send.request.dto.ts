import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, MaxLength, IsArray } from 'class-validator';
import { ENUM_MESSAGE_TYPE } from '../../enums/messaging.enum';

export class MessageSendRequestDto {
    @ApiProperty({
        example: 'Hello! How are you?',
        description: 'Message content',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;

    @ApiProperty({
        enum: ENUM_MESSAGE_TYPE,
        example: ENUM_MESSAGE_TYPE.TEXT,
        description: 'Message type',
        required: false,
    })
    @IsOptional()
    @IsEnum(ENUM_MESSAGE_TYPE)
    messageType?: ENUM_MESSAGE_TYPE;

    @ApiProperty({
        type: [Object],
        description: 'Array of files (for file messages)',
        required: false,
        example: [
            {
                fileUrl: 'https://example.com/file1.jpg',
                fileName: 'image1.jpg',
                fileSize: 1024,
                mimeType: 'image/jpeg'
            }
        ],
    })
    @IsOptional()
    @IsArray()
    files?: Array<{
        fileUrl: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
    }>;
}
