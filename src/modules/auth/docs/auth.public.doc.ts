import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/enums/doc.enum';
import { AuthLoginRequestDto } from 'src/modules/auth/dtos/request/auth.login.request.dto';
import { AuthLoginResponseDto } from 'src/modules/auth/dtos/response/auth.login.response.dto';
import { AuthRefreshResponseDto } from 'src/modules/auth/dtos/response/auth.refresh.response.dto';

export function AuthPublicLoginDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Login for all types of users',
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: AuthLoginRequestDto,
        }),
        DocResponse<AuthLoginResponseDto>('auth.login', {
            dto: AuthLoginResponseDto,
        })
    );
}

export function AuthPublicRefreshDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'refresh a token',
        }),
        DocAuth({
            jwtRefreshToken: true,
        }),
        DocResponse<AuthRefreshResponseDto>('auth.refresh', {
            dto: AuthRefreshResponseDto,
        })
    );
}
