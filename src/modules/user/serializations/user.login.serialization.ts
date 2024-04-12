import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginSerialization {
    @ApiProperty({
        example: faker.internet.userName(),
        description: 'The logged in user username',
        required: true,
    })
    readonly username: string;

    @ApiProperty({
        example: faker.person.firstName(),
        description: 'The logged in user first name',
        required: true,
    })
    readonly firstName: string;

    @ApiProperty({
        example: faker.person.lastName(),
        description: 'The logged in user last name',
        required: true,
    })
    readonly lastName: string;

    @ApiProperty({
        example: 'admin',
        description: 'The logged in user role',
        required: true,
    })
    readonly role: string;

    @ApiProperty({
        example: 'Bearer',
        required: true,
    })
    readonly tokenType: string;

    @ApiProperty({
        example: 1660190937231,
        description: 'Expire in timestamp',
        required: true,
    })
    readonly expiresIn: string;

    @ApiProperty({
        example:  faker.string.alphanumeric(30),
        description: 'Will be valid JWT Encode string',
        required: true,
    })
    readonly accessToken: string;

    @ApiProperty({
        example:  faker.string.alphanumeric(30),
        description: 'Will be valid JWT Encode string',
        required: true,
    })
    @ApiProperty()
    readonly refreshToken: string;
}
