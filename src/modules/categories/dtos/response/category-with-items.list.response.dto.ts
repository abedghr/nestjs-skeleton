import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    enableLocalized,
    LocalizationDto,
} from 'src/common/database/dtos/localization.dto';

export class CategoryWithItemsListResponseDto {
    @Expose()
    @ApiProperty()
    _id: string;

    @Expose()
    @ApiProperty()
    @enableLocalized()
    name: LocalizationDto;
}
