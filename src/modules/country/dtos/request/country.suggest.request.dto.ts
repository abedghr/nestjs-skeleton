import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CountrySuggestRequestDto {
    @ApiProperty({
        required: true,
        type: String,
        example: 'jo',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(5)
    @Transform(({ value }) => value.toLowerCase())
    countryCode: string;
}
