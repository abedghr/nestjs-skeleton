import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    IsOptional,
    IsUUID,
    IsEnum,
    MinLength,
} from 'class-validator';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';
import { IsAllowedMobileNumber } from 'src/common/request/validations/request.mobile-number.validation';
import { ENUM_POLICY_ROLE_TYPE } from 'src/modules/policy/enums/policy.enum';

export class UserCreateRequestDto {
    @ApiProperty({
        example: faker.internet.userName(),
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(3)
    @Type(() => String)
    username: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: true,
    })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'Mobile number with country code',
        required: true,
        nullable: false,
        example: '+962786968783',
    })
    @IsAllowedMobileNumber(Object.values(ENUM_AVAILABLE_COUNTRIES), {
        message: 'Invalid mobile number',
    })
    @IsString()
    @IsNotEmpty()
    mobileNumber: string;

    @ApiProperty({
        example: faker.internet.email(),
        required: false,
        maxLength: 100,
    })
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    @MaxLength(100)
    @Type(() => String)
    email?: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    country: string;

    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID()
    role: string;

    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(ENUM_POLICY_ROLE_TYPE)
    roleType: ENUM_POLICY_ROLE_TYPE;
}
