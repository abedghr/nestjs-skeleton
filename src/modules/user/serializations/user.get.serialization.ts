import { faker } from '@faker-js/faker';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ENUM_CREATE_USER_ROLE_TYPE } from 'src/common/auth/constants/auth.role.enum.constant';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { USER_GENDER } from '../constants/user.enum.constants';

export class UserGetSerialization extends ResponseIdSerialization {

    @Expose()
    @ApiProperty({
        example: ENUM_CREATE_USER_ROLE_TYPE.USER,
    })
    readonly type: ENUM_CREATE_USER_ROLE_TYPE;
    
    @Expose()
    @ApiProperty({
        example: faker.internet.userName(),
    })
    readonly username: string;

    @Expose()
    @ApiProperty({
        example: faker.internet.email(),
    })
    readonly email: string;

    @Expose()
    @ApiProperty({
        example: faker.phone.number(),
    })
    readonly mobileNumber?: string;

    @Expose()
    @ApiProperty({
        example: USER_GENDER.MALE,
    })
    readonly gender: USER_GENDER;

    @Expose()
    @ApiProperty({
        example: true,
    })
    readonly isActive: boolean;

    @Expose()
    @ApiProperty({
        example: faker.person.firstName(),
    })
    readonly firstName: string;

    @Expose()
    @ApiProperty({
        example: faker.person.lastName(),
    })
    readonly lastName: string;

    @Expose()
    @ApiProperty({
        allOf: [{ $ref: getSchemaPath(AwsS3Serialization) }],
    })
    readonly photo?: AwsS3Serialization;

    @Expose()
    @ApiProperty({
        example: faker.date.recent(),
    })
    readonly signUpDate: Date;

    @Expose()
    @ApiProperty({
        example: false,
    })
    readonly isDeleted: Boolean;
    
    @Expose()
    @ApiProperty({
        example: "Spam User",
    })
    readonly deletedReason: string;

    @Expose()
    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
    })
    readonly createdAt: Date;

    @Expose()
    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: false,
    })
    readonly updatedAt: Date;

}
