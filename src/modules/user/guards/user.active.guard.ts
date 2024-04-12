import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc } from '../repositories/entities/user.entity';
import { USER_ACTIVE_META_KEY } from '../constants/user.constant';

@Injectable()
export class UserActiveGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            USER_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()]
        );
        

        if (!required) {
            return true;
        }

        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();


        
        if (!required.includes(__user.isActive)) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'user.error.isActiveInvalid',
            });
        }
        return true;
    }
}
