import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { NotificationUserSaveFcmDoc } from 'src/modules/notification/docs/notification.user.doc';
import { NotificationSaveFcmRequestDto } from 'src/modules/notification/dtos/request/notification.save-fcm.request.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';

@ApiTags('modules.user.notification')
@Controller({
    version: '1',
    path: '/notification',
})
export class NotificationUserController {
    constructor(private userService: UserService) {}

    @NotificationUserSaveFcmDoc()
    @AuthJwtAccessProtected()
    @Post('/save-fcm')
    async saveFcmToken(
        @AuthJwtPayload<AuthJwtAccessPayloadDto>()
        user: AuthJwtAccessPayloadDto,
        @Body() body: NotificationSaveFcmRequestDto
    ): Promise<void> {
        await this.userService.saveFcmToken(user._id, body);
    }
}
