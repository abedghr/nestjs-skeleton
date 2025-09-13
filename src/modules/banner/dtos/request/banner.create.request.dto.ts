import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';

export class BannerCreateRequestDto {
    @ApiProperty({
        example: faker.lorem.words(3),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Type(() => String)
    title: string;

    @ApiProperty({
        example: faker.lorem.sentence(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    @Type(() => String)
    description?: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: faker.string.uuid(),
        required: true,
    })
    country: string;

    @ApiProperty({
        description: 'Banner image file',
        type: 'string',
        format: 'binary',
        required: true,
    })
    imageUrl: any;

    @ApiProperty({
        example: faker.internet.url(),
        required: true,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    @Type(() => String)
    redirectUrl: string;

    @ApiProperty({
        example: true,
        required: true,
    })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive: boolean;

    @ApiProperty({
        type: AwsS3Dto,
        required: false,
    })
    @Type(() => AwsS3Dto)
    image?: AwsS3Dto;
}
