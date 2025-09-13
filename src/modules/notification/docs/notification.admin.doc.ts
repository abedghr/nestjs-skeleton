// notification.admin.doc.ts (no major changes)

import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { NotificationDocParamsId } from 'src/modules/notification/constants/notification.doc.constant';
import { NotificationGetResponseDto } from 'src/modules/notification/dtos/response/notification.get.response.dto';
import { NotificationAdminListResponseDto } from 'src/modules/notification/dtos/response/notification.admin-list.response.dto';

export function NotificationAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get all of notifications',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<NotificationAdminListResponseDto>(
            'notification.list',
            {
                dto: NotificationAdminListResponseDto,
            }
        )
    );
}

export function NotificationAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get detail a notification',
        }),
        DocRequest({
            params: NotificationDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<NotificationGetResponseDto>('notification.get', {
            dto: NotificationGetResponseDto,
        })
    );
}

export function NotificationTopicsListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get all of notifications topics list',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<NotificationAdminListResponseDto>('notification.topicsList')
    );
}
