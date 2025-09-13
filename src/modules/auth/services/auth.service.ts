import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import verifyAppleToken from 'verify-apple-id-token';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { IAuthService } from 'src/modules/auth/interfaces/auth.service.interface';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { AuthJwtRefreshPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.refresh-payload.dto';
import { IAuthPassword } from 'src/modules/auth/interfaces/auth.interface';
import { AuthSocialApplePayloadDto } from 'src/modules/auth/dtos/social/auth.social.apple-payload.dto';
import { AuthSocialGooglePayloadDto } from 'src/modules/auth/dtos/social/auth.social.google-payload.dto';
import { ENUM_AUTH_LOGIN_FROM } from 'src/modules/auth/enums/auth.enum';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { TokenType } from 'src/modules/auth/enums/token.enum';
import { IUserAuthDoc } from 'src/modules/user/interfaces/user.interface';
import {
    ENUM_LOGIN_SOURCE,
    ENUM_POLICY_ROLE_TYPE,
} from 'src/modules/policy/enums/policy.enum';

@Injectable()
export class AuthService implements IAuthService {
    // jwt
    private readonly jwtAccessTokenSecretKey: string;
    private readonly jwtAccessTokenExpirationTime: number;

    private readonly jwtRefreshTokenSecretKey: string;
    private readonly jwtRefreshTokenExpirationTime: number;

    private readonly jwtPrefixAuthorization: string;
    private readonly jwtAudience: string;
    private readonly jwtIssuer: string;

    // password
    private readonly passwordSaltLength: number;

    private readonly passwordAttempt: boolean;
    private readonly passwordMaxAttempt: number;
    private readonly defaultPassword = 'Password@1234';
    private readonly defaultSuperAdminPassword = 'Admin@1234';

    // apple
    private readonly appleClientId: string;
    private readonly appleSignInClientId: string;

    // google
    private readonly googleClient: OAuth2Client;

    private readonly sourceRoleMap = {
        [ENUM_LOGIN_SOURCE.DASHBOARD]: ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
        [ENUM_LOGIN_SOURCE.PROVIDER_APP]: ENUM_POLICY_ROLE_TYPE.PROVIDER,
        [ENUM_LOGIN_SOURCE.CUSTOMER_APP]: ENUM_POLICY_ROLE_TYPE.CUSTOMER,
    } as const;

    constructor(
        private readonly helperHashService: HelperHashService,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
        private readonly helperEncryptionService: HelperEncryptionService,
        private readonly configService: ConfigService
    ) {
        // jwt
        this.jwtAccessTokenSecretKey = this.configService.get<string>(
            'auth.jwt.accessToken.secretKey'
        );
        this.jwtAccessTokenExpirationTime = this.configService.get<number>(
            'auth.jwt.accessToken.expirationTime'
        );

        this.jwtRefreshTokenSecretKey = this.configService.get<string>(
            'auth.jwt.refreshToken.secretKey'
        );
        this.jwtRefreshTokenExpirationTime = this.configService.get<number>(
            'auth.jwt.refreshToken.expirationTime'
        );

        this.jwtPrefixAuthorization = this.configService.get<string>(
            'auth.jwt.prefixAuthorization'
        );
        this.jwtAudience = this.configService.get<string>('auth.jwt.audience');
        this.jwtIssuer = this.configService.get<string>('auth.jwt.issuer');

        this.passwordSaltLength = this.configService.get<number>(
            'auth.password.saltLength'
        );

        this.passwordAttempt = this.configService.get<boolean>(
            'auth.password.attempt'
        );
        this.passwordMaxAttempt = this.configService.get<number>(
            'auth.password.maxAttempt'
        );

        // apple
        this.appleClientId = this.configService.get<string>(
            'auth.apple.clientId'
        );
        this.appleSignInClientId = this.configService.get<string>(
            'auth.apple.signInClientId'
        );

        // google
        this.googleClient = new OAuth2Client(
            this.configService.get<string>('auth.google.clientId'),
            this.configService.get<string>('auth.google.clientSecret')
        );
    }

    createAccessToken(
        subject: string,
        payload: AuthJwtAccessPayloadDto
    ): string {
        return this.helperEncryptionService.jwtEncrypt(
            { ...payload },
            {
                secretKey: this.jwtAccessTokenSecretKey,
                expiredIn: this.jwtAccessTokenExpirationTime,
                audience: this.jwtAudience,
                issuer: this.jwtIssuer,
                subject,
            }
        );
    }

    validateAccessToken(subject: string, token: string): boolean {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.jwtAccessTokenSecretKey,
            audience: this.jwtAudience,
            issuer: this.jwtIssuer,
            subject,
        });
    }

    payloadAccessToken(token: string): AuthJwtAccessPayloadDto {
        return this.helperEncryptionService.jwtDecrypt<AuthJwtAccessPayloadDto>(
            token
        );
    }

    createRefreshToken(
        subject: string,
        payload: AuthJwtRefreshPayloadDto
    ): string {
        return this.helperEncryptionService.jwtEncrypt(
            { ...payload },
            {
                secretKey: this.jwtRefreshTokenSecretKey,
                expiredIn: this.jwtRefreshTokenExpirationTime,
                audience: this.jwtAudience,
                issuer: this.jwtIssuer,
                subject,
            }
        );
    }

    validateRefreshToken(subject: string, token: string): boolean {
        return this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.jwtRefreshTokenSecretKey,
            audience: this.jwtAudience,
            issuer: this.jwtIssuer,
            subject,
        });
    }

    payloadRefreshToken(token: string): AuthJwtRefreshPayloadDto {
        return this.helperEncryptionService.jwtDecrypt<AuthJwtRefreshPayloadDto>(
            token
        );
    }

    validateUserPassword(
        passwordString: string,
        passwordHash: string
    ): boolean {
        return this.helperHashService.bcryptCompare(
            passwordString,
            passwordHash
        );
    }

    createPayloadAccessToken<T extends Document>(
        data: T,
        loginFrom: ENUM_AUTH_LOGIN_FROM
    ): AuthJwtAccessPayloadDto {
        const loginDate = this.helperDateService.create();
        const plainObject: any = data.toObject();

        return plainToInstance(AuthJwtAccessPayloadDto, {
            _id: plainObject._id,
            type: plainObject.role.type,
            status: plainObject.status,
            mobileNumber: plainObject.mobileNumber,
            role: plainObject.role._id,
            email: plainObject.email,
            permissions: plainObject.role.permissions,
            loginDate,
            loginFrom,
        });
    }
    createPayloadAccessTokenOtp(
        phone: string,
        loginFrom: ENUM_AUTH_LOGIN_FROM
    ): AuthJwtAccessPayloadDto {
        const loginDate = this.helperDateService.create();

        return plainToInstance(AuthJwtAccessPayloadDto, {
            phone: phone,
            loginDate,
            loginFrom,
        });
    }
    createPayloadRefreshToken({
        _id,
        loginFrom,
        loginDate,
    }: AuthJwtAccessPayloadDto): AuthJwtRefreshPayloadDto {
        return {
            _id,
            loginFrom,
            loginDate,
        };
    }

    createSalt(length: number): string {
        return this.helperHashService.randomSalt(length);
    }

    createPassword(password: string): IAuthPassword {
        const salt: string = this.createSalt(this.passwordSaltLength);

        const passwordCreated: Date = this.helperDateService.create();
        const passwordHash = this.helperHashService.bcrypt(password, salt);
        return {
            passwordHash,
            passwordCreated,
            salt,
        };
    }

    getDefaultSuperAdminPassword(): string {
        return this.defaultSuperAdminPassword;
    }

    createPasswordRandom(): string {
        return this.helperStringService.random(10);
    }

    getTokenType(): string {
        return this.jwtPrefixAuthorization;
    }

    getAccessTokenExpirationTime(): number {
        return this.jwtAccessTokenExpirationTime;
    }

    getRefreshTokenExpirationTime(): number {
        return this.jwtRefreshTokenExpirationTime;
    }

    getIssuer(): string {
        return this.jwtIssuer;
    }

    getAudience(): string {
        return this.jwtAudience;
    }

    getPasswordAttempt(): boolean {
        return this.passwordAttempt;
    }

    getPasswordMaxAttempt(): number {
        return this.passwordMaxAttempt;
    }

    getDefaultPassword(): string {
        return this.defaultPassword;
    }

    async appleGetTokenInfo(
        idToken: string
    ): Promise<AuthSocialApplePayloadDto> {
        const payload = await verifyAppleToken({
            idToken,
            clientId: [this.appleClientId, this.appleSignInClientId],
        });

        return { email: payload.email };
    }

    async googleGetTokenInfo(
        idToken: string
    ): Promise<AuthSocialGooglePayloadDto> {
        const login: LoginTicket = await this.googleClient.verifyIdToken({
            idToken: idToken,
        });
        const payload = login.getPayload();

        return { email: payload.email };
    }

    async createForgotPasswordToken(userId: string): Promise<string> {
        const payload = {
            userId,
            type: TokenType.FORGOT_PASSWORD,
        };

        return this.helperEncryptionService.jwtEncrypt(payload, {
            secretKey: this.jwtAccessTokenSecretKey, // You might want to use a different secret key for password reset
            expiredIn: 900, // 15 minutes
            audience: this.jwtAudience,
            issuer: this.jwtIssuer,
            subject: 'forgotPassword',
        });
    }

    async validateForgotPasswordToken(token: string): Promise<string | null> {
        const check: boolean = this.helperEncryptionService.jwtVerify(token, {
            secretKey: this.jwtAccessTokenSecretKey,
            audience: this.jwtAudience,
            issuer: this.jwtIssuer,
            subject: 'forgotPassword',
        });

        if (!check) {
            return null;
        }

        const tokenDetails = this.helperEncryptionService.jwtDecrypt<{
            userId: string;
            sub: string;
            type: TokenType;
        }>(token);

        if (tokenDetails.type !== TokenType.FORGOT_PASSWORD) {
            return null;
        }

        return tokenDetails.userId ?? null;
    }

    getUserCredentialsTokens(user: IUserAuthDoc) {
        const tokenType: string = this.getTokenType();

        const expiresInAccessToken: number =
            this.getAccessTokenExpirationTime();
        const payloadAccessToken: AuthJwtAccessPayloadDto =
            this.createPayloadAccessToken(
                user,
                ENUM_AUTH_LOGIN_FROM.CREDENTIAL
            );

        const accessToken: string = this.createAccessToken(
            user.mobileNumber,
            payloadAccessToken
        );

        const payloadRefreshToken: AuthJwtRefreshPayloadDto =
            this.createPayloadRefreshToken(payloadAccessToken);
        const refreshToken: string = this.createRefreshToken(
            user.mobileNumber,
            payloadRefreshToken
        );
        return {
            tokenType,
            accessToken,
            refreshToken,
            expiresIn: expiresInAccessToken,
        };
    }

    validateAuthenticationSource(
        user: IUserAuthDoc,
        source: ENUM_LOGIN_SOURCE
    ) {
        return user?.role?.type === this.sourceRoleMap[source];
    }
}
