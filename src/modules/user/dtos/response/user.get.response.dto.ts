import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
    ENUM_USER_GENDER,
    ENUM_USER_SIGN_UP_FROM,
    ENUM_USER_STATUS,
} from 'src/modules/user/enums/user.enum';
import { DatabaseDto } from 'src/common/database/dtos/database.dto';

export class UserGetResponseDto extends DatabaseDto {
    @ApiProperty({
        required: true,
        nullable: false,
    })
    @Expose()
    username: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    @Type(() => String)
    @Expose()
    mobileNumber: string;

    @ApiProperty({
        required: false,
        nullable: false,
        example: faker.internet.email(),
    })
    @Expose()
    email: string;

    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.string.uuid(),
    })
    @Expose()
    role: string;

    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.date.recent(),
    })
    @Expose()
    @Transform(({ value }) => value.toISOString())
    signUpDate: Date;

    @ApiProperty({
        required: true,
        nullable: false,
        example: ENUM_USER_SIGN_UP_FROM.DASHBOARD,
    })
    @Expose()
    signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @ApiProperty({
        required: true,
        nullable: false,
        example: ENUM_USER_STATUS.ACTIVE,
    })
    @Expose()
    status: ENUM_USER_STATUS;

    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    @Expose()
    country: string;

    @ApiProperty({
        required: false,
        nullable: false,
    })
    @Expose()
    firstName?: string;

    @ApiProperty({
        required: false,
        nullable: false,
    })
    @Expose()
    lastName?: string;

    @ApiProperty({
        example: ENUM_USER_GENDER.MALE,
        enum: ENUM_USER_GENDER,
        required: false,
        nullable: true,
    })
    @Expose()
    gender?: ENUM_USER_GENDER;

    @ApiProperty({
        example: faker.date.birthdate(),
        required: false,
        nullable: true,
    })
    @Expose()
    dateOfBirth?: Date;

    @ApiHideProperty()
    @Exclude()
    password: string;

    @ApiHideProperty()
    @Exclude()
    passwordCreated: Date;

    @ApiHideProperty()
    @Exclude()
    salt: string;
}
