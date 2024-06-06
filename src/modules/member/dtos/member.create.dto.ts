import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
    IsOptional,
} from 'class-validator';

export class MemberCreateDto {
    public static EMAIL = 'admin@gmail.com';

    @ApiProperty({
        example: MemberCreateDto.EMAIL,
        required: false,
    })
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(300)
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
        description: 'gender',
        example: 'male',
        required: false,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    @Type(() => String)
    readonly gender: string;
}
