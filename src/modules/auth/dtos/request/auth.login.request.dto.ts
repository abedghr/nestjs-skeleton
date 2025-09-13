import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ENUM_LOGIN_SOURCE } from 'src/modules/policy/enums/policy.enum';

export class AuthLoginRequestDto {
    @ApiProperty({
        required: true,
        nullable: false,
        example: 'superadmin',
    })
    @MinLength(5)
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'string password',
        required: true,
        nullable: false,
        example: 'Admin@1234',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        required: true,
        nullable: false,
        example: ENUM_LOGIN_SOURCE.DASHBOARD,
    })
    @IsEnum(ENUM_LOGIN_SOURCE)
    @IsString()
    @IsNotEmpty()
    source: ENUM_LOGIN_SOURCE;
}
