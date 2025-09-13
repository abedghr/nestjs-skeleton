import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthSocialGooglePayloadDto } from 'src/modules/auth/dtos/social/auth.social.google-payload.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class AuthSocialGoogleGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp<AuthSocialGooglePayloadDto>>();
        const { authorization } = request.headers;
        const acArr = authorization?.split('Bearer ') ?? [];
        if (acArr.length !== 2) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.socialGoogle',
            });
        }

        const accessToken: string = acArr[1];

        try {
            const payload: AuthSocialGooglePayloadDto =
                await this.authService.googleGetTokenInfo(accessToken);

            request.user = {
                email: payload.email,
            };

            return true;
        } catch (err: any) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'auth.error.socialGoogle',
                _error: err.message,
            });
        }
    }
}
