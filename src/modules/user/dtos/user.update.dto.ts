import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserCreateDto } from './user.create.dto';
import { ENUM_CREATE_USER_ROLE_TYPE } from 'src/common/auth/constants/auth.role.enum.constant';
import { Type } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { USER_GENDER } from '../constants/user.enum.constants';

export class UserUpdateDto extends UserCreateDto {
  @ApiProperty({
    example: ENUM_CREATE_USER_ROLE_TYPE.USER,
    required: true,
  })
  @IsOptional()
  @IsEnum(ENUM_CREATE_USER_ROLE_TYPE)
  @IsNotEmpty()
  @Type(() => String)
  readonly type: string;

  @ApiProperty({
    example: UserCreateDto.USERNAME,
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  readonly username: string;

  @ApiProperty({
    example: faker.person.firstName(),
    required: true,
  })
  @IsOptional()
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
  @IsOptional()
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
  @IsOptional()
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
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @Type(() => String)
  readonly gender: USER_GENDER;

  @ApiProperty({
    description: 'string password',
    example: UserUpdateDto.PASSWORD,
    required: true,
  })
  @IsEmpty()
  @IsOptional()
  @MaxLength(50)
  @MinLength(8)
  readonly password: string;
}
