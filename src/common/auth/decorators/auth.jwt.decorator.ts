import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthJwtAccessGuard } from 'src/common/auth/guards/jwt-access/auth.jwt-access.guard';
import { AuthJwtRefreshGuard } from 'src/common/auth/guards/jwt-refresh/auth.jwt-refresh.guard';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { RolePayloadTypeGuard } from '../guards/payload/role.payload.type.guard';
import { ROLE_TYPE_META_KEY } from '../constants/auth.role.constant';
import { ENUM_ROLE_TYPE } from '../constants/auth.role.enum.constant';

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtAdminAccessProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
        SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.SUPER_ADMIN, ENUM_ROLE_TYPE.ADMIN])
    );
}

export function AuthJwtRefreshProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
