// src/modules/auth/dtos/request/auth.send-otp.request.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAllowedMobileNumber } from 'src/common/request/validations/request.mobile-number.validation';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';

export class AuthSendOtpRequestDto {
    @ApiProperty({
        example: '+962790000000',
        description: 'Phone number in international format',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @IsAllowedMobileNumber(Object.values(ENUM_AVAILABLE_COUNTRIES))
    phone: string;
}
