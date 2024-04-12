import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc } from 'src/modules/user/repositories/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserDoc }>();
            
        const { user } = request;
        
        const checkUser: UserDoc = await this.userService.findOneById(user._id.toString(), {
            join: true,
        });

        if (checkUser) {
            request.__user = checkUser.toObject();
        }

        return true;
    }
}
