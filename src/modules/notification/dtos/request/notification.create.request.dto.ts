import { IsEnum, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ENUM_FIREBASE_TOPICS } from 'src/modules/firebase/constants/firebase.enum';

export class NotificationCreateRequestDto {
    @ApiProperty()
    @IsString()
    @MaxLength(255)
    readonly title: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    readonly body: string;

    @ApiProperty()
    @IsEnum(ENUM_FIREBASE_TOPICS)
    readonly topic: ENUM_FIREBASE_TOPICS;

    @ApiPropertyOptional()
    @IsString()
    readonly data: Record<string, any>;

    @ApiProperty()
    @IsString()
    redirectUrl: string;
}
