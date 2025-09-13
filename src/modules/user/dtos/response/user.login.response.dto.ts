import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserLoginResponseDto {
    @Expose()
    @ApiProperty()
    username: string;

    @ApiProperty()
    @Expose()
    email: string | null;

    @Expose()
    @ApiProperty()
    @Transform(({ value }) => value ?? null)
    firstName: string;

    @Expose()
    @ApiProperty()
    @Transform(({ value }) => value ?? null)
    lastName?: string;
}
