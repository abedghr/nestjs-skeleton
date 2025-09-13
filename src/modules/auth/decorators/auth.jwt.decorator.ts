import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import {
    AuthJwtAccessGuard,
    AuthAdminJwtAccessGuard,
    AuthCustomerJwtAccessGuard,
    JwtCustomerOptionalAccessGuard,
    AuthJwtProviderAccessGuard,
} from 'src/modules/auth/guards/jwt/auth.jwt.access.guard';
import { AuthJwtRefreshGuard } from 'src/modules/auth/guards/jwt/auth.jwt.refresh.guard';

export const AuthJwtPayload = createParamDecorator(
    <T = AuthJwtAccessPayloadDto>(data: string, ctx: ExecutionContext): T => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: T }>();
        return data ? user[data] : user;
    }
);

export const AuthJwtToken = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): string => {
        const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
        const { authorization } = headers;
        const authorizations: string[] = authorization?.split(' ') ?? [];

        return authorizations.length >= 2 ? authorizations[1] : undefined;
    }
);

export function AuthJwtCustomerOptionalProtected(): MethodDecorator {
    return applyDecorators(UseGuards(JwtCustomerOptionalAccessGuard));
}

export function AuthCustomerJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthCustomerJwtAccessGuard));
}

export function AuthAdminJwtAccessProtected(
    providerProtected: boolean = false
): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthAdminJwtAccessGuard),
        SetMetadata('providerProtected', providerProtected)
    );
}

export function AuthJwtProviderAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtProviderAccessGuard));
}

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
