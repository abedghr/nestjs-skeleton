import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/repositories/user.repository';
import {
  IDatabaseCreateOptions,
  IDatabaseFindOneOptions,
} from 'src/common/database/mongo/interfaces/database.interface';
import { UserDoc, UserEntity } from '../repositories/entities/user.entity';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { plainToInstance } from 'class-transformer';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserCreateDto } from '../dtos/user.create.dto';
import {
  ICreateUserLogicOptions,
  IUpdateUserLogicOptions,
} from '../interfaces/user.interface';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { USER_DELETE_TYPES } from '../constants/user.enum.constants';
import { UserDeleteDto } from '../dtos/user.delete.dto';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { IFile, IFileDetails } from 'src/common/file/interfaces/file.interface';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { FileHelperService } from 'src/common/file/services/file.helper.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly uploadPath: string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly helperDateService: HelperDateService,
    private readonly fileHelperService: FileHelperService,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath');
  }

  async findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const user = this.userRepository.findOne<T>({ email }, options);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const user = await this.userRepository.findOneById<T>(_id, options);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async create(
    {
      username,
      email,
      firstName,
      lastName,
      mobileNumber,
      gender,
    }: UserRegisterDto | UserCreateDto,
    { passwordHash, salt }: IAuthPassword,
    options?: IDatabaseCreateOptions,
    logicOptions: ICreateUserLogicOptions = {},
  ): Promise<UserDoc> {
    const usernameExists: boolean = await this.userRepository.exists({
      username,
    });

    if (usernameExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.usernameExists',
      });
    }

    const emailExist: boolean = await this.userRepository.exists({ email });
    if (emailExist) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.emailExist',
      });
    }

    if (mobileNumber) {
      const mobileNumberExist: boolean = await this.userRepository.exists({
        mobileNumber,
      });

      if (mobileNumberExist) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'user.error.mobileNumberExist',
        });
      }
    }

    const create: UserEntity = new UserEntity();
    create.username = username;
    create.email = email;
    create.firstName = firstName;
    create.lastName = lastName;
    create.password = passwordHash;
    create.salt = salt;

    if (!logicOptions.createdByAdmin) {
      create.signUpDate = this.helperDateService.create();
    }

    if (logicOptions.createdBy) {
      create.createdBy = logicOptions.createdBy;
    }

    create.mobileNumber = mobileNumber ?? undefined;
    create.gender = gender;

    const user: UserDoc = await this.userRepository.create<UserEntity>(
      create,
      options,
    );

    return user;
  }

  async payloadSerialization(data: UserDoc): Promise<UserPayloadSerialization> {
    return plainToInstance(UserPayloadSerialization, data.toObject());
  }

  async update(
    user: string,
    {
      username,
      email,
      firstName,
      lastName,
      mobileNumber,
      gender,
    }: UserUpdateDto,
    passwordHashWithSalt?: IAuthPassword,
    options?: IDatabaseCreateOptions,
    logicOptions: IUpdateUserLogicOptions = {},
  ): Promise<UserDoc> {
    const updatedUser: UserDoc = await this.userRepository.findOneById(user);

    if (!updatedUser) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }
    
    if (updatedUser.username !== username) {
      const usernameExists: boolean = await this.userRepository.exists({
        username,
      });

      if (usernameExists) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'user.error.usernameExists',
        });
      }
    }

    if (updatedUser.email !== email) {
      const emailExist: boolean = await this.userRepository.exists({ email });
      if (emailExist) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'user.error.emailExist',
        });
      }
    }

    if (updatedUser.mobileNumber !== mobileNumber) {
      if (mobileNumber) {
        const mobileNumberExist: boolean = await this.userRepository.exists({
          mobileNumber,
        });

        if (mobileNumberExist) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'user.error.mobileNumberExist',
          });
        }
      }
    }

    updatedUser.username = username || updatedUser.username;
    updatedUser.email = email || updatedUser.email;
    updatedUser.firstName = firstName || updatedUser.firstName;
    updatedUser.lastName = lastName || updatedUser.lastName;
    if (passwordHashWithSalt) {
      updatedUser.password = passwordHashWithSalt.passwordHash;
      updatedUser.salt = passwordHashWithSalt.salt;
    }

    if (logicOptions.updatedBy) {
      updatedUser.updatedBy = logicOptions.updatedBy;
    }

    updatedUser.mobileNumber = mobileNumber || updatedUser.mobileNumber;
    updatedUser.gender = gender || updatedUser.gender;

    const userUpdated: UserDoc = await this.userRepository.update(
      updatedUser,
      options,
    );

    return userUpdated;
  }

  async deleteById(
    user: string,
    bodyParams: UserDeleteDto,
    viewer: UserDoc,
  ): Promise<void> {
    const withDeleted: boolean = bodyParams.type === USER_DELETE_TYPES.HARD;
    const userToDelete: UserDoc = await this.userRepository.findOneById(user, {
      withDeleted,
    });

    if (!userToDelete) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (bodyParams.type === USER_DELETE_TYPES.SOFT) {
      userToDelete.deletedBy = viewer._id.toString();
      userToDelete.deleteReason = bodyParams.reason;
      await this.userRepository.softDelete(userToDelete);
    } else if (bodyParams.type === USER_DELETE_TYPES.HARD) {
      await this.userRepository.delete(userToDelete);
    }
  }

  async getList(
    { _limit, _offset, _order }: PaginationListDto,
    find: Record<string, any> = {},
  ) {
    const users: UserEntity[] = await this.userRepository.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
      withDeleted: true,
    });

    const total: number = await this.userRepository.getTotal(find, {
      withDeleted: true,
    });

    return {
      list: users,
      total,
    };
  }

  async uploadPhoto(user: string, viewer: UserDoc, file: IFile) {
    const userDetails: UserDoc = await this.userRepository.findOneById(user);

    if (!userDetails) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const { fileName, content, path }: IFileDetails =
      await this.fileHelperService.prepareFileDetails(
        file,
        this.uploadPath,
        user,
      );
    
    const aws = await this.awsS3Service.putItemInBucket(
      fileName,
      content,
      {
        path,
      },
      'uploadUserPhotoFailure',
    );
    userDetails.photo = aws;
    await this.userRepository.update(userDetails);
    return;
  }
}
