import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class MemberGetSerialization extends ResponseIdSerialization {
    
    @Expose()
    @ApiProperty({
        example: faker.internet.email(),
    })
    readonly email: string;

    @Expose()
    @ApiProperty({
        example: 'male',
    })
    readonly gender: string;

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
}
