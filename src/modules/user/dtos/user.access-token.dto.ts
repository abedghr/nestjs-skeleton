import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsString} from 'class-validator';

export class AccessTokenDto {
    private static EMAIL = 'admin@gmail.com';
    private static PASSWORD = 'admin1234';

    @ApiProperty({
        example: AccessTokenDto.EMAIL,
        required: true,
    })
    @IsEmail()
    @Type(() => String)
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @ApiProperty({
        description: 'string password',
        example: AccessTokenDto.PASSWORD,
        required: true,
    })
    @IsString()
    @Type(() => String)
    readonly password: string;
}
