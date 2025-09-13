import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';
import { SafeString } from 'src/common/request/validations/request.safe-string.validation';
import {
    ENUM_SETTING_DATA_TYPE,
    ENUM_SETTING_NAME,
} from 'src/modules/setting/enums/setting.enum';

export class SettingCreateRequestDto {
    @IsString()
    @IsNotEmpty()
    @SafeString()
    @IsEnum(ENUM_SETTING_NAME)
    name: ENUM_SETTING_NAME;

    @IsString()
    @IsOptional()
    @Type(() => String)
    @ApiProperty({
        name: 'description',
        examples: ['Maintenance Mode', 'Max Part Number Aws Chunk File'],
        description: 'The description about setting',
        nullable: true,
    })
    description?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Data type of setting',
        example: 'BOOLEAN',
        required: true,
        enum: ENUM_SETTING_DATA_TYPE,
    })
    @IsEnum(ENUM_SETTING_DATA_TYPE)
    type: ENUM_SETTING_DATA_TYPE;

    @IsNotEmpty()
    @Type(() => String)
    @ApiProperty({
        name: 'value',
        description: 'The value of setting',
        nullable: false,
        oneOf: [
            { type: 'string', readOnly: true, examples: ['on', 'off'] },
            { type: 'number', readOnly: true, examples: [100, 200] },
            { type: 'boolean', readOnly: true, examples: [true, false] },
        ],
    })
    value: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ApiProperty({
        name: 'code',
        description: 'The Country Code for the setting',
        nullable: true,
        example: Object.values(ENUM_AVAILABLE_COUNTRIES),
    })
    code?: string;
}
