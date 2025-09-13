import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_CATEGORY_STATUS } from 'src/modules/categories/constants/category.enum';
import { CategoryGetRequestDto } from 'src/modules/categories/dtos/request/category.get.request.dto';

export class CategoryChangeStatusRequestDto extends CategoryGetRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ENUM_CATEGORY_STATUS)
    status: ENUM_CATEGORY_STATUS;
}
