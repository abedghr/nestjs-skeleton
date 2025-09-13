import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CountryShortResponseDto } from 'src/modules/country/dtos/response/country.short.response.dto';
import { RoleGetResponseDto } from 'src/modules/role/dtos/response/role.get.response.dto';
import { UserGetResponseDto } from 'src/modules/user/dtos/response/user.get.response.dto';

export class SuperUserProfileResponseDto extends OmitType(UserGetResponseDto, [
    'role',
    'country',
] as const) {
    @Expose()
    @ApiProperty({
        required: true,
        nullable: false,
        type: RoleGetResponseDto,
    })
    @Type(() => RoleGetResponseDto)
    role: RoleGetResponseDto;

    @Expose()
    @ApiProperty({
        required: true,
        nullable: false,
        type: CountryShortResponseDto,
    })
    @Type(() => CountryShortResponseDto)
    country: CountryShortResponseDto;
}
