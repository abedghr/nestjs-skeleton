import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CountryShortResponseDto } from 'src/modules/country/dtos/response/country.short.response.dto';
import { RoleListResponseDto } from 'src/modules/role/dtos/response/role.list.response.dto';
import { UserGetResponseDto } from 'src/modules/user/dtos/response/user.get.response.dto';

export class SuperUserListResponseDto extends OmitType(UserGetResponseDto, [
    'role',
    'country',
    'password',
    'salt',
    'passwordCreated',
] as const) {
    @ApiProperty({
        required: true,
        nullable: false,
        type: RoleListResponseDto,
    })
    @Type(() => RoleListResponseDto)
    role: RoleListResponseDto;

    @ApiProperty({
        required: true,
        nullable: false,
        type: CountryShortResponseDto,
    })
    @Type(() => CountryShortResponseDto)
    country: CountryShortResponseDto;
}
