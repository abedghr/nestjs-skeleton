import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    HttpStatus
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc } from '../repositories/entities/user.entity';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();

        if (!__user) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'user.error.notFound',
            });
        }

        return true;
    }
}
