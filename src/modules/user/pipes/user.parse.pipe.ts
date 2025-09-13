import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/enums/user.status-code.enum';
import { IUserJoinsDoc } from 'src/modules/user/interfaces/user.interface';
import { UserAuthDoc } from 'src/modules/user/repository/entities/user-auth.entity';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserAuthService } from 'src/modules/user/services/user.auth.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class UserParsePipe implements PipeTransform {
    constructor(private readonly userService: UserService) {}

    async transform(value: string): Promise<UserDoc> {
        const user: UserDoc = await this.userService.findOneById(value);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'user.error.notFound',
            });
        }

        return user;
    }
}

@Injectable()
export class UserAuthParsePipe implements PipeTransform {
    constructor(private readonly userAuthService: UserAuthService) {}

    async transform(value: string): Promise<UserAuthDoc> {
        const user: UserAuthDoc = await this.userAuthService.findOneById(value);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'user.error.notFound',
            });
        }

        return user;
    }
}

@Injectable()
export class UserActiveParsePipe implements PipeTransform {
    constructor(private readonly userService: UserService) {}

    async transform(value: string): Promise<UserDoc & IUserJoinsDoc> {
        const user = await this.userService.findOneWithJoinsById(value);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'user.error.notFound',
            });
        }

        return user;
    }
}
