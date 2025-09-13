import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LocalizationDto } from 'src/common/database/dtos/localization.dto';
import { CategoryAdminGetResponseDto } from 'src/modules/categories/dtos/response/category.admin-get.response.dto';

export class CategoryGetResponseDto extends OmitType(
    CategoryAdminGetResponseDto,
    ['name']
) {
    @Expose()
    @ApiProperty()
    name: LocalizationDto;
}
