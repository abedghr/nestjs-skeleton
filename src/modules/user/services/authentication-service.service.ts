import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccessTokenDto } from '../dtos/user.access-token.dto';
import { UserDoc } from '../repositories/entities/user.entity';
import { UserRepository } from '../repositories/repositories/user.repository';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { AuthService } from 'src/common/auth/services/auth.service';
import { UserService } from './user.service';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  async accessToken({ email, password }: AccessTokenDto): Promise<object> {
    const user: UserDoc = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      password,
      user.password,
    );

    if (!validate) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.passwordNotMatch',
      });
    }

    const { expiresIn, accessToken, refreshToken } =
      await this.generateAuthTokens(user);

    return {
      ...user.toObject(),
      ...{
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(user: UserDoc) {
    const { expiresIn, accessToken, refreshToken } =
      await this.generateAuthTokens(user);

    return {
      ...user.toObject(),
      ...{
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }

  async register({
    email,
    mobileNumber,
    username,
    ...body
  }: UserRegisterDto): Promise<UserDoc> {
    const emailExist: boolean = await this.userRepository.exists({ email });

    if (emailExist) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'user.error.emailExist',
      });
    }

    if (mobileNumber) {
      const mobileNumberExist: boolean = await this.userRepository.exists({
        mobileNumber,
      });

      if (mobileNumberExist) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'user.error.mobileNumberExist',
        });
      }
    }

    const passwordAndSalt: IAuthPassword =
      await this.authService.createPassword(body.password);

    const user: UserDoc = await this.userService.create(
      {
        email,
        mobileNumber,
        username,
        ...body,
      },
      passwordAndSalt,
    );

    return user;
  }

  async generateAuthTokens(user: UserDoc): Promise<any> {
    const payload: UserPayloadSerialization =
      await this.userService.payloadSerialization(user);

    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();

    let payloadAccessToken: Record<string, any> | string =
      await this.authService.createPayloadAccessToken(payload);

    let payloadRefreshToken: Record<string, any> | string =
      await this.authService.createPayloadRefreshToken(payload._id, {
        loginDate: payloadAccessToken.loginDate,
      });

    const payloadEncryption = await this.authService.getPayloadEncryption();

    if (payloadEncryption) {
      payloadAccessToken = await this.authService.encryptAccessToken(
        payloadAccessToken,
      );

      payloadRefreshToken = await this.authService.encryptRefreshToken(
        payloadRefreshToken,
      );
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadRefreshToken,
    );

    return {
      expiresIn,
      accessToken,
      refreshToken,
    };
  }
}
