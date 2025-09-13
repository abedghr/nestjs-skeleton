import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationSaveFcmRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly fcmToken: string;
}
