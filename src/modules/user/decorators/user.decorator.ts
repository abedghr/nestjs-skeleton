import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc, UserEntity } from '../repositories/entities/user.entity';
import { UserPayloadPutToRequestGuard } from '../guards/payload/user.payload.put-to-request.guard';
import { UserNotFoundGuard } from '../guards/user.not-found.guard';
import { UserActiveGuard } from '../guards/user.active.guard';
import { USER_ACTIVE_META_KEY } from '../constants/user.constant';

export const GetLoggedInUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserDoc | UserEntity => {
    const { __user } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { __user: UserDoc }>();
    return __user;
  },
);

export function UserProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard),
  );
}

export function UserAuthProtected(): MethodDecorator {
  return applyDecorators(
      UseGuards(
          UserActiveGuard
      ),
      SetMetadata(USER_ACTIVE_META_KEY, [true])
  );
}