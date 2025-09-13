import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BannerAdminListResponseDto } from 'src/modules/banner/dtos/response/banner.admin-list.response.dto';

export class BannerShortResponseDto extends OmitType(
    BannerAdminListResponseDto,
    ['createdAt', 'updatedAt']
) {
    @ApiHideProperty()
    @Exclude()
    createdAt: Date;

    @ApiHideProperty()
    @Exclude()
    updatedAt: Date;
}
