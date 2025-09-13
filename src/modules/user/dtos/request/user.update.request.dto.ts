import { faker } from '@faker-js/faker';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserCreateRequestDto } from 'src/modules/user/dtos/request/user.create.request.dto';
import { ENUM_USER_GENDER } from 'src/modules/user/enums/user.enum';

export class UserUpdateRequestDto extends PickType(UserCreateRequestDto, [
    'email',
] as const) {
    @ApiProperty({
        example: faker.person.firstName(),
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    firstName?: string;

    @ApiProperty({
        example: faker.person.lastName(),
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    lastName?: string;

    @ApiProperty({
        example: ENUM_USER_GENDER.MALE,
        required: false,
    })
    @IsOptional()
    @IsEnum(ENUM_USER_GENDER)
    gender?: ENUM_USER_GENDER;

    @ApiProperty({
        example: faker.date.birthdate(),
        required: false,
    })
    @IsOptional()
    dateOfBirth?: Date;
}
