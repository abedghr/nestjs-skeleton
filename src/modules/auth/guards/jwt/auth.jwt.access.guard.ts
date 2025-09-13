import { AuthGuard } from '@nestjs/passport';
import {
    ExecutionContext,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { ENUM_POLICY_ROLE_TYPE } from 'src/modules/policy/enums/policy.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwtAccess') {
    handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
        if (err || !user) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.accessTokenUnauthorized',
                _error: err ? err.message : info.message,
            });
        }

        return user;
    }
}

@Injectable()
export class AuthAdminJwtAccessGuard extends AuthGuard('jwtAccess') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Call the super method to validate the JWT token and set the user in request
        const canActivate = await super.canActivate(context);
        if (!canActivate) return false;

        const request = context.switchToHttp().getRequest();
        const user: AuthJwtAccessPayloadDto = request.user;

        const providerProtected = this.getProviderProtectedMetadata(context);

        if (!user) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.accessTokenUnauthorized',
            });
        }

        if (
            ![
                ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
                ENUM_POLICY_ROLE_TYPE.PROVIDER,
            ].includes(user.type)
        ) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.accessTokenUnauthorized',
            });
        }

        // Check shop ownership if owner protection is enabled
        if (providerProtected && user.type === ENUM_POLICY_ROLE_TYPE.PROVIDER) {
            const salonId =
                request.params.salon ||
                request.body.salon ||
                request.query.salon;

            if (salonId) {
                throw new UnauthorizedException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'auth.error.accessTokenUnauthorized',
                });
            }

            const userId =
                request.params.user || request.body.user || request.query.user;
            if (userId) {
                throw new NotFoundException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'auth.error.accessTokenUnauthorized',
                });
            }
        }

        return true;
    }

    private getProviderProtectedMetadata(context: ExecutionContext): boolean {
        const handler = context.getHandler();
        return (
            this.reflector.get<boolean>('providerProtected', handler) || false
        );
    }
}

@Injectable()
export class AuthCustomerJwtAccessGuard extends AuthGuard('jwtAccess') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const canActivate = await super.canActivate(context);
        if (!canActivate) return false;

        const request = context.switchToHttp().getRequest();
        const user: AuthJwtAccessPayloadDto = request.user;

        if (!user || user.type !== ENUM_POLICY_ROLE_TYPE.CUSTOMER) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.accessTokenUnauthorized',
            });
        }
        return true;
    }
}

@Injectable()
export class JwtCustomerOptionalAccessGuard extends AuthGuard('jwtAccess') {
    handleRequest(err, user) {
        if (err || !user) {
            return null;
        }
        if (user.type !== ENUM_POLICY_ROLE_TYPE.CUSTOMER) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.accessTokenUnauthorized',
            });
        }
        return user;
    }
}

@Injectable()
export class AuthJwtProviderAccessGuard extends AuthGuard('jwtAccess') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const canActivate = await super.canActivate(context);
        if (!canActivate) return false;

        const request = context.switchToHttp().getRequest();
        const user: AuthJwtAccessPayloadDto = request.user;

        const checkIfUserRoleIsProvider =
            user.type === ENUM_POLICY_ROLE_TYPE.PROVIDER;

        const check = !user || !checkIfUserRoleIsProvider;

        if (check) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.accessTokenUnauthorized',
            });
        }
        return true;
    }
}
