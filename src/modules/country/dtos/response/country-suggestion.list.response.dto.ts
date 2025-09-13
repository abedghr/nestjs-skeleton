import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CountrySuggestionListResponseDto {
    @Expose()
    @ApiProperty()
    _id: string;

    @Expose()
    @ApiProperty()
    countryCode: string;

    @Expose()
    @ApiProperty()
    count: number;
}
