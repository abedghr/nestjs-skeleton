import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DatabaseDto } from 'src/common/database/dtos/database.dto';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';

export class CountryGetResponseDto extends DatabaseDto {
    @ApiProperty({
        required: true,
        type: String,
        description: 'Country name',
        example: faker.location.country(),
        maxLength: 100,
        minLength: 1,
    })
    @Expose()
    name: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, Alpha 2 code version',
        example: faker.location.countryCode('alpha-2'),
        maxLength: 2,
        minLength: 2,
    })
    @Expose()
    alpha2Code: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, Alpha 3 code version',
        example: faker.location.countryCode('alpha-3'),
        maxLength: 3,
        minLength: 3,
    })
    @Expose()
    alpha3Code: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, Numeric code version',
        example: faker.location.countryCode('numeric'),
        maxLength: 3,
        minLength: 3,
    })
    @Expose()
    numericCode: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country code, FIPS version',
        example: faker.location.countryCode('alpha-2'),
        maxLength: 2,
        minLength: 2,
    })
    @Expose()
    fipsCode: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Country phone code',
        example: [faker.helpers.arrayElement(['62', '65'])],
        maxLength: 4,
        minLength: 4,
        isArray: true,
        default: [],
    })
    @Expose()
    phoneCode: string[];

    @ApiProperty({
        required: true,
        example: faker.location.country(),
    })
    @Expose()
    continent: string;

    @ApiProperty({
        required: true,
        example: faker.location.timeZone(),
    })
    @Expose()
    timeZone: string;

    @ApiProperty({
        required: false,
        description: 'Top level domain',
        example: faker.internet.domainSuffix(),
    })
    @Expose()
    domain?: string;

    @ApiProperty({
        required: false,
        type: AwsS3Dto,
    })
    @Type(() => AwsS3Dto)
    @Expose()
    image?: AwsS3Dto;
}
