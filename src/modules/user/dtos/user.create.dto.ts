import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
    ValidateIf,
    IsOptional,
    IsEnum,
    Matches,
} from 'class-validator';
import { USER_GENDER } from '../constants/user.enum.constants';
import { ENUM_CREATE_USER_ROLE_TYPE } from 'src/common/auth/constants/auth.role.enum.constant';
import { REGEX_EMAIL } from '../constants/user.regex.constants';

export class UserCreateDto {
    public static USERNAME = 'admin';
    public static EMAIL = 'admin@gmail.com';
    public static PASSWORD = 'admin1234';

    @ApiProperty({
        example: ENUM_CREATE_USER_ROLE_TYPE.USER,
        required: true,
    })
    @IsEnum(ENUM_CREATE_USER_ROLE_TYPE)
    @IsNotEmpty()
    @Type(() => String)
    readonly type: string;
    
    @ApiProperty({
        example: UserCreateDto.USERNAME,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => value.toLowerCase())
    @Type(() => String)
    readonly username: string;

    @ApiProperty({
        example: UserCreateDto.EMAIL,
        required: false,
    })
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(300)
    @Matches(REGEX_EMAIL)
    @Transform(({ value }) => value.toLowerCase())
    @Type(() => String)
    readonly email: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(40)
    @Type(() => String)
    readonly firstName: string;

    @ApiProperty({
        example: faker.person.lastName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(40)
    @Type(() => String)
    readonly lastName: string;

    @ApiProperty({
        example: faker.phone.number(),
        required: true,
    })
    @IsString()
    @MinLength(10)
    @MaxLength(14)
    @IsNotEmpty()
    @ValidateIf((e) => e.mobileNumber !== '')
    @Type(() => String)
    readonly mobileNumber: string;

    @ApiProperty({
        description: 'gender',
        example: 'male',
        required: false,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    @Type(() => String)
    readonly gender: USER_GENDER;
}
