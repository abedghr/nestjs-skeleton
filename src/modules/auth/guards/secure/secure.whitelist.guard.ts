import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
    private allowedIp = [];

    constructor(private readonly configService: ConfigService) {
        this.allowedIp = this.configService.get<string[]>(
            'app.ipWhitelistArray'
        );
    }

    canActivate(context: ExecutionContext): boolean {
        console.log('ALLOWED IP', this.allowedIp);
        const request = context.switchToHttp().getRequest<Request>();
        const clientIp = request.ip || request.connection.remoteAddress;

        if (process.env.APP_ENV === 'development') {
            console.log('DEVELOPMENT MODE');
            return true;
        }

        if (!this.allowedIp.includes(clientIp)) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}
