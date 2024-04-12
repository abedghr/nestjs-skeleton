import { AuthGuard } from '@nestjs/passport';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt') {
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
