import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsOptional, IsString, MaxLength } from 'class-validator';
import { RESPONSE_LOCALIZATION_FIELD_META_KEY } from 'src/common/response/constants/response.constant';

export function enableLocalized(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const existingFields =
            Reflect.getMetadata(
                RESPONSE_LOCALIZATION_FIELD_META_KEY,
                target.constructor
            ) || [];

        Reflect.defineMetadata(
            RESPONSE_LOCALIZATION_FIELD_META_KEY,
            [...existingFields, propertyKey],
            target.constructor
        );
    };
}

export class LocalizationDto {
    @Expose()
    @ApiProperty({ example: 'field in English' })
    @IsString()
    @IsDefined()
    @MaxLength(255)
    en: string;

    @Expose()
    @ApiProperty({ example: 'field in Arabic' })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    ar?: string;
}
