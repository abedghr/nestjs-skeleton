// src/modules/auth/dtos/response/auth.send-otp.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthSendOtpResponseDto {
    @ApiProperty({
        example: true,
        description: 'Whether the OTP was sent successfully',
    })
    sent: boolean;

    @ApiProperty({
        example: 60,
        description: 'Seconds until next retry is allowed',
    })
    retryIn: number;
}
