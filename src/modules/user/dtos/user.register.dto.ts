import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';
import { USER_GENDER } from '../constants/user.enum.constants';
import { UserCreateDto } from './user.create.dto';

export class UserRegisterDto extends OmitType(UserCreateDto, [
    'type',
] as const) {

    public static USERNAME = 'admin';
    public static EMAIL = 'admin@gmail.com';
    public static PASSWORD = 'admin1234';

    @ApiProperty({
        description: 'string password',
        example: UserRegisterDto.PASSWORD,
        required: true,
    })
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(8)
    readonly password: string;
}
