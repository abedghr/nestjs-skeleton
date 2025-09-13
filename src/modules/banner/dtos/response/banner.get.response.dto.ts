import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { DatabaseDto } from 'src/common/database/dtos/database.dto';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';

export class BannerGetResponseDto extends DatabaseDto {
    @ApiProperty({
        required: true,
        type: String,
        description: 'Banner title',
        example: faker.commerce.productName(),
        maxLength: 255,
        minLength: 1,
    })
    title: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'Banner description',
        example: faker.lorem.sentence(),
        maxLength: 500,
    })
    description?: string;

    @ApiProperty({
        required: false,
        type: AwsS3Dto,
        description: 'Image associated with the banner',
    })
    @Type(() => AwsS3Dto)
    image?: AwsS3Dto;

    @ApiProperty({
        required: true,
        type: String,
        description: 'URL to redirect when the banner is clicked',
        example: faker.internet.url(),
        maxLength: 500,
    })
    redirectUrl: string;

    @ApiProperty({
        required: true,
        type: Boolean,
        description: 'Indicates whether the banner is active',
        example: true,
    })
    isActive: boolean;

    @ApiHideProperty()
    @Exclude()
    deletedAt?: Date;
}
