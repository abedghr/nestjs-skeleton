import {
    BadRequestException,
    Inject,
    Injectable,
    PipeTransform,
    Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/enums/user.status-code.enum';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserNotSelfPipe implements PipeTransform {
    constructor(@Inject(REQUEST) protected readonly request: IRequestApp) {}

    async transform(value: UserDoc): Promise<UserDoc> {
        const { user } = this.request;
        if (user._id === value._id) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_SELF,
                message: 'user.error.notSelf',
            });
        }

        return value;
    }
}
