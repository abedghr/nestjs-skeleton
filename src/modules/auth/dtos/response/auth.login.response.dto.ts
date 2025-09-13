import { Expose, Type } from 'class-transformer';
import { AuthTokensResponseDto } from 'src/modules/auth/dtos/response/auth.tokens.response.dto';
import { UserLoginResponseDto } from 'src/modules/user/dtos/response/user.login.response.dto';

export class AuthLoginResponseDto {
    @Expose()
    @Type(() => UserLoginResponseDto)
    user: UserLoginResponseDto;

    @Expose()
    @Type(() => AuthTokensResponseDto)
    tokens: AuthTokensResponseDto | null;
}
