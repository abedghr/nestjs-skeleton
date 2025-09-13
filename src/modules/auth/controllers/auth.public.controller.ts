import { UserAuthService } from '../../user/services/user.auth.service';
import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/common/response/decorators/response.decorator';
import {
    AuthPublicLoginDoc,
    AuthPublicRefreshDoc,
} from 'src/modules/auth/docs/auth.public.doc';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { AuthLoginRequestDto } from 'src/modules/auth/dtos/request/auth.login.request.dto';
import {
    AuthJwtPayload,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { AuthJwtRefreshPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.refresh-payload.dto';
import { AuthRefreshResponseDto } from 'src/modules/auth/dtos/response/auth.refresh.response.dto';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/enums/role.status-code.enum';
import { AuthLoginResponseDto } from 'src/modules/auth/dtos/response/auth.login.response.dto';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { AuthService } from 'src/modules/auth/services/auth.service';

@ApiTags('modules.public.auth')
@Controller({
    version: '1',
    path: '/auth',
})
export class AuthPublicController {
    constructor(
        private readonly authService: AuthService,
        private readonly userAuthService: UserAuthService
    ) {}

    @AuthPublicLoginDoc()
    @Response('auth.login', {
        serialization: AuthLoginResponseDto,
    })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(
        @Body() { username, password, source }: AuthLoginRequestDto
    ): Promise<IResponse<any>> {
        const userWithJoins = await this.userAuthService.findOneWithJoins({
            username,
            status: ENUM_USER_STATUS.ACTIVE,
        });

        const validateSource = this.authService.validateAuthenticationSource(
            userWithJoins,
            source
        );

        if (!validateSource) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'auth.error.invalidCredential',
            });
        }
        const validatePassword: boolean = this.authService.validateUserPassword(
            password,
            userWithJoins.password
        );

        if (!validatePassword) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'auth.error.invalidCredential',
            });
        }

        const tokens = this.authService.getUserCredentialsTokens(userWithJoins);

        return {
            data: {
                user: {
                    username: userWithJoins.username,
                    email: userWithJoins.email,
                    firstName: userWithJoins.firstName,
                },
                tokens,
            },
        };
    }

    @AuthPublicRefreshDoc()
    @Response('auth.refresh')
    @AuthJwtRefreshProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refresh(
        @AuthJwtToken() refreshToken: string,
        @AuthJwtPayload<AuthJwtRefreshPayloadDto>()
        { _id }: AuthJwtRefreshPayloadDto
    ): Promise<IResponse<AuthRefreshResponseDto>> {
        const userWithJoins = await this.userAuthService.findOneActiveById(
            _id,
            {
                join: true,
            }
        );

        if (!userWithJoins.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.INACTIVE_FORBIDDEN,
                message: 'role.error.inactive',
            });
        }

        const tokens = this.authService.getUserCredentialsTokens(userWithJoins);

        return {
            data: {
                user: {
                    username: userWithJoins.username,
                    email: userWithJoins.email,
                    firstName: userWithJoins.firstName,
                },
                tokens,
            },
        };
    }
}
