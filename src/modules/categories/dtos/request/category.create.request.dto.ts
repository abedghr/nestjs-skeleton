import { LocalizationDto } from '../../../../common/database/dtos/localization.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class CategoryCreateRequestDto {
    @ApiProperty({
        required: true,
        type: () => LocalizationDto,
        description: 'Category name in multiple languages',
        minLength: 5,
        maxLength: 100,
    })
    @IsDefined() // Ensures that `en` must be explicitly provided
    @ValidateNested() // Validate nested object
    @Type(() => LocalizationDto)
    name: LocalizationDto;

    @ApiProperty({
        required: false,
        type: Number,
        default: 0,
        description: 'Category order',
    })
    @IsOptional()
    @IsNumber()
    order?: number;
}
