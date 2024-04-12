import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  UserCreateDoc,
  UserDeleteDoc,
  UserGetDoc,
  UserListDoc,
  UserUpdateDoc,
} from '../docs/user.doc';
import { Response, ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { UserGetSerialization } from '../serializations/user.get.serialization';
import { UserCreateDto } from '../dtos/user.create.dto';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { UserDoc, UserEntity } from '../repositories/entities/user.entity';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/common/auth/services/auth.service';
import { GetLoggedInUser, UserProtected } from '../decorators/user.decorator';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserDeleteDto } from '../dtos/user.delete.dto';
import {
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_PER_PAGE,
} from '../constants/user.list.constant';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';

@ApiTags('Admin.User')
@Controller({
  version: '1',
  path: '/admin/user',
})
export class AdminControllerController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly paginationService: PaginationService,
  ) {}

  @UserCreateDoc()
  @Response('user.create', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.CREATED)
  @UserProtected()
  @AuthJwtAdminAccessProtected()
  @Post('/')
  async create(
    @GetLoggedInUser() viewer: UserDoc,
    @Body() body: UserCreateDto,
  ): Promise<IResponse> {
    const passwordWithSalt = await this.authService.createPassword(
      this.authService.getDefaultPassword(),
    );
    const createdUser: UserDoc = await this.userService.create(
      body,
      passwordWithSalt,
      {},
      { createdByAdmin: true, createdBy: viewer._id.toString() },
    );
    return {
      data: createdUser.toObject(),
    };
  }

  @UserUpdateDoc()
  @Response('user.update', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @AuthJwtAdminAccessProtected()
  @Put('/:user')
  async update(
    @GetLoggedInUser() viewer: UserDoc,
    @Param('user') user: string,
    @Body() body: UserUpdateDto,
  ): Promise<IResponse> {
    let passwordWithSalt = null;
    if (body.password) {
      passwordWithSalt = await this.authService.createPassword(body.password);
    }

    const updatedUser: UserDoc = await this.userService.update(
      user,
      body,
      passwordWithSalt,
      {},
      { updatedBy: viewer._id.toString() },
    );
    return {
      data: updatedUser.toObject(),
    };
  }

  @UserDeleteDoc()
  @Response('user.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UserProtected()
  @AuthJwtAdminAccessProtected()
  @Delete('/:user')
  async delete(
    @GetLoggedInUser() viewer: UserDoc,
    @Param('user') user: string,
    @Body() body: UserDeleteDto,
  ): Promise<IResponse> {
    if (viewer._id.toString() === user) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'user.error.sameViewer',
      });
    }
    await this.userService.deleteById(user, body, viewer);
    return null;
  }

  @UserGetDoc()
  @Response('user.get', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @AuthJwtAdminAccessProtected()
  @Get('/:user')
  async get(@Param('user') user: string): Promise<IResponse> {
    const userDetails: UserDoc = await this.userService.findOneById(user, {
      withDeleted: true,
    });
    return {
      data: userDetails.toObject(),
    };
  }

  @UserListDoc()
  @ResponsePaging('user.list', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @AuthJwtAdminAccessProtected()
  @Get('/')
  async list(
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    paginationParam: PaginationListDto,
  ): Promise<IResponsePaging> {
    const { list, total }: { list: UserEntity[]; total: number } =
      await this.userService.getList(paginationParam);
    const totalPage: number = this.paginationService.totalPage(
      total,
      paginationParam._limit,
    );
    
    return {
      _pagination: { total, totalPage},
      data: list,
    };
  }
}
