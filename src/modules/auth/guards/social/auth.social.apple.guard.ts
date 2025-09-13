import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthSocialApplePayloadDto } from 'src/modules/auth/dtos/social/auth.social.apple-payload.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class AuthSocialAppleGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp<AuthSocialApplePayloadDto>>();
        const { authorization } = request.headers;
        const acArr = authorization?.split('Bearer ') ?? [];

        if (acArr.length !== 2) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.socialApple',
            });
        }

        const accessToken: string = acArr[1];

        try {
            const payload: AuthSocialApplePayloadDto =
                await this.authService.appleGetTokenInfo(accessToken);

            request.user = {
                email: payload.email,
            };

            return true;
        } catch (err: any) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.socialApple',
                _error: err.message,
            });
        }
    }
}
