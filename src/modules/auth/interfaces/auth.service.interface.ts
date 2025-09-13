import { Document } from 'mongoose';
import { ENUM_AUTH_LOGIN_FROM } from 'src/modules/auth/enums/auth.enum';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { AuthJwtRefreshPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.refresh-payload.dto';
import { AuthSocialApplePayloadDto } from 'src/modules/auth/dtos/social/auth.social.apple-payload.dto';
import { AuthSocialGooglePayloadDto } from 'src/modules/auth/dtos/social/auth.social.google-payload.dto';
import {
    IAuthPassword,
    IAuthPasswordOptions,
} from 'src/modules/auth/interfaces/auth.interface';

export interface IAuthService {
    createAccessToken(
        subject: string,
        payload: AuthJwtAccessPayloadDto
    ): string;
    validateAccessToken(subject: string, token: string): boolean;
    payloadAccessToken(token: string): AuthJwtAccessPayloadDto;
    createRefreshToken(
        subject: string,
        payload: AuthJwtRefreshPayloadDto
    ): string;
    validateRefreshToken(subject: string, token: string): boolean;
    payloadRefreshToken(token: string): AuthJwtRefreshPayloadDto;
    validateUserPassword(passwordString: string, passwordHash: string): boolean;
    createPayloadAccessToken<T extends Document>(
        data: T,
        loginFrom: ENUM_AUTH_LOGIN_FROM
    ): AuthJwtAccessPayloadDto;
    createPayloadRefreshToken({
        _id,
        loginFrom,
        loginDate,
    }: AuthJwtAccessPayloadDto): AuthJwtRefreshPayloadDto;
    createSalt(length: number): string;
    createPassword(
        password: string,
        options?: IAuthPasswordOptions
    ): IAuthPassword;
    createPasswordRandom(): string;
    getTokenType(): string;
    getAccessTokenExpirationTime(): number;
    getRefreshTokenExpirationTime(): number;
    getIssuer(): string;
    getAudience(): string;
    getPasswordAttempt(): boolean;
    getPasswordMaxAttempt(): number;
    appleGetTokenInfo(code: string): Promise<AuthSocialApplePayloadDto>;
    googleGetTokenInfo(
        accessToken: string
    ): Promise<AuthSocialGooglePayloadDto>;
}
