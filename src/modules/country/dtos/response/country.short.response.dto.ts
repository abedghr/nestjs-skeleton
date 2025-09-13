import { OmitType } from '@nestjs/swagger';
import { CountryGetResponseDto } from 'src/modules/country/dtos/response/country.get.response.dto';

export class CountryShortResponseDto extends OmitType(CountryGetResponseDto, [
    'domain',
    'timeZone',
    'alpha3Code',
    'numericCode',
    'fipsCode',
    'image',
]) {
}
