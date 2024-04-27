import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuthProfileDoc, UserAuthRefreshTokenDoc, UserAuthRegisterDoc, UserAuthTokenDoc } from '../docs/user.auth.doc';
import { Response } from 'src/common/response/decorators/response.decorator';
import { UserAccessRefreshTokenSerialization } from '../serializations/user.access-refresh-tokens.serialization';
import { AccessTokenDto } from '../dtos/user.access-token.dto';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { AuthenticationService } from '../services/authentication-service.service';
import { UserDoc } from '../repositories/entities/user.entity';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserGetSerialization } from '../serializations/user.get.serialization';
import { AuthJwtAccessProtected, AuthJwtRefreshProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { GetViewer, UserAuthProtected, UserProtected } from '../decorators/user.decorator';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';

@ApiTags('Auth')
@Controller({
  version: '1',
  path: '/user',
})
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UserAuthTokenDoc()
  @Response('user.accessToken', {
    serialization: UserAccessRefreshTokenSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/access-token')
  async accessToken(@Body() body: AccessTokenDto): Promise<IResponse> {
    return {
      data: await this.authService.accessToken(body),
    };
  }

  @UserAuthRefreshTokenDoc()
  @Response('user.refresh', { serialization: UserAccessRefreshTokenSerialization })
  @UserAuthProtected()
  @UserProtected()
  @AuthJwtRefreshProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refresh(
      @GetViewer() viewer: UserDoc
  ): Promise<IResponse> {
      return {
        data: await this.authService.refreshToken(viewer)
      }
      
  }

  @UserAuthRegisterDoc()
  @Response('user.register', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async signUp(@Body() body: UserRegisterDto): Promise<IResponse> {
    const user: UserDoc = await this.authService.register(body);
    return {
      data: user.toObject(),
    };
  }

  @UserAuthProfileDoc()
  @Response('user.profile', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(@GetViewer() viewer: UserDoc): Promise<IResponse> {
    return {
      data: viewer,
    };
  }
}
