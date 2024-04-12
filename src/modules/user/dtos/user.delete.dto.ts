import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { USER_DELETE_TYPES } from '../constants/user.enum.constants';

export class UserDeleteDto {

    @ApiProperty({
        description: 'delete action type (soft|hard)',
        example: USER_DELETE_TYPES.SOFT,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(USER_DELETE_TYPES)
    readonly type: string;


    @ApiProperty({
        description: 'Reason for soft delete (required only when the type equal "soft")',
        example: "spam",
        required: false,
    })
    @ValidateIf(object => object.type === USER_DELETE_TYPES.SOFT)
    @IsNotEmpty()
    @MaxLength(300)
    @MinLength(3)
    readonly reason?: string;
}
