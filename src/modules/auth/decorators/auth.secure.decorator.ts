import { applyDecorators, UseGuards } from '@nestjs/common';
import { IpWhitelistGuard } from 'src/modules/auth/guards/secure/secure.whitelist.guard';

export function IpWhitelistProtected(): MethodDecorator {
    return applyDecorators(UseGuards(IpWhitelistGuard));
}
