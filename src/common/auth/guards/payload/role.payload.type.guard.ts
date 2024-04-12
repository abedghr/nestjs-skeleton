import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HelperArrayService } from 'src/common/helper/services/helper.array.service';
import { ENUM_ROLE_TYPE } from '../../constants/auth.role.enum.constant';
import { ROLE_TYPE_META_KEY } from '../../constants/auth.role.constant';

@Injectable()
export class RolePayloadTypeGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly helperArrayService: HelperArrayService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredFor: ENUM_ROLE_TYPE[] = this.reflector.getAllAndOverride<
            ENUM_ROLE_TYPE[]
        >(ROLE_TYPE_META_KEY, [context.getHandler(), context.getClass()]);

        const { user } = context.switchToHttp().getRequest();
        const { type } = user;

        if (!requiredFor) {
            return true;
        }

        const hasFor: boolean = this.helperArrayService.includes(
            requiredFor,
            type
        );

        if (!hasFor) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'role.error.typeForbidden',
            });
        }
        return hasFor;
    }
}
