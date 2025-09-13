import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthTokensResponseDto {
    @Expose()
    @ApiProperty({
        example: 'Bearer',
        required: true,
        nullable: false,
    })
    tokenType: string;

    @Expose()
    @ApiProperty({
        example: 3600,
        description: 'timestamp in minutes',
        required: true,
        nullable: false,
    })
    expiresIn: number;

    @Expose()
    @ApiProperty({
        required: true,
        nullable: false,
    })
    accessToken: string;

    @Expose()
    @ApiProperty({
        required: true,
        nullable: false,
    })
    refreshToken: string;
}
