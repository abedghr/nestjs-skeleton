import { OmitType } from '@nestjs/swagger';
import { CountryGetResponseDto } from 'src/modules/country/dtos/response/country.get.response.dto';

export class CountryListResponseDto extends OmitType(CountryGetResponseDto, [
    'alpha3Code',
    'fipsCode',
    'continent',
    'domain',
    'timeZone',
    'numericCode',
] as const) {}
