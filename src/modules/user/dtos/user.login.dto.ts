import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsString} from 'class-validator';
// import { ENUM_ROLE_TYPE } from 'src/common/role/constants/role.enum.constant';

export class UserLoginDto {
    private static EMAIL = 'admin@gmail.com';
    private static PASSWORD = 'admin1234';

    @ApiProperty({
        example: UserLoginDto.EMAIL,
        required: true,
    })
    @IsEmail()
    @Type(() => String)
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @ApiProperty({
        description: 'string password',
        example: UserLoginDto.PASSWORD,
        required: true,
    })
    @IsString()
    @Type(() => String)
    readonly password: string;

    // @ApiProperty({
    //     description: 'user role type (USER, MEMBER, ADMIN, SUPER_ADMIN)',
    //     example: ENUM_ROLE_TYPE.SUPER_ADMIN,
    //     required: true,
    // })
    // @IsNotEmpty()
    // @IsString({ each: true })
    // @Type(() => String)
    // @Transform(({ value }) => (value ? value.split(',').map((item: ENUM_ROLE_TYPE) => item.toUpperCase()) : [ENUM_ROLE_TYPE.SUPER_ADMIN]))
    // readonly roleType: ENUM_ROLE_TYPE[];
}
