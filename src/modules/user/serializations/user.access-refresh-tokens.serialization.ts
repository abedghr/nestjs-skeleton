import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class UserAccessRefreshTokenSerialization extends ResponseIdSerialization {
    @Expose()
    @ApiProperty({
        example: faker.internet.userName(),
        description: 'The logged in user username',
        required: true,
    })
    readonly username: string;

    @Expose()
    @ApiProperty({
        example: faker.person.firstName(),
        description: 'The logged in user first name',
        required: true,
    })
    readonly email: string;

    @Expose()
    @ApiProperty({
        example: 1660190937231,
        description: 'Expire in timestamp',
        required: true,
    })
    readonly expiresIn: string;

    @Expose()
    @ApiProperty({
        example:  faker.string.alphanumeric(30),
        description: 'Will be valid JWT Encode string',
        required: true,
    })
    readonly accessToken: string;

    @Expose()
    @ApiProperty({
        example:  faker.string.alphanumeric(30),
        description: 'Will be valid JWT Encode string',
        required: true,
    })
    readonly refreshToken: string;
}
