import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LocalizationDto } from 'src/common/database/dtos/localization.dto';
import { ENUM_CATEGORY_STATUS } from 'src/modules/categories/constants/category.enum';

export class CategoryAdminListResponseDto {
    @Expose()
    @ApiProperty()
    _id: string;

    @Expose()
    @ApiProperty()
    name: LocalizationDto;

    @Expose()
    @ApiProperty()
    status: ENUM_CATEGORY_STATUS;
}
