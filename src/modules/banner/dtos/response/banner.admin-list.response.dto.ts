import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';
import { BannerGetResponseDto } from 'src/modules/banner/dtos/response/banner.get.response.dto';

export class BannerAdminListResponseDto extends OmitType(BannerGetResponseDto, [
    'title',
    'description',
    'image',
    'redirectUrl',
    'isActive',
    'createdAt',
    'updatedAt',
] as const) {
    @ApiHideProperty()
    @Exclude()
    title: string;

    @ApiHideProperty()
    @Exclude()
    description?: string;

    @ApiHideProperty()
    @Exclude()
    image?: AwsS3Dto;

    @ApiHideProperty()
    @Exclude()
    redirectUrl: string;

    @ApiHideProperty()
    @Exclude()
    isActive: boolean;

    @ApiHideProperty()
    @Exclude()
    createdAt: Date;

    @ApiHideProperty()
    @Exclude()
    updatedAt: Date;
}
