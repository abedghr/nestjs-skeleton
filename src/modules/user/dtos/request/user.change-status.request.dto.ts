import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';

export class UserChangeStatusRequestDto {
    @ApiProperty({
        example: ENUM_USER_STATUS.ACTIVE,
        required: false,
    })
    @IsEnum(ENUM_USER_STATUS)
    @IsNotEmpty()
    status: string;
}
