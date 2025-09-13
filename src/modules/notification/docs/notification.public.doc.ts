import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { NotificationAdminListResponseDto } from 'src/modules/notification/dtos/response/notification.admin-list.response.dto';

export function NotificationListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get active notifications list',
            extra: {
                location: true,
            },
        }),
        DocResponsePaging<NotificationAdminListResponseDto>(
            'notification.list',
            {
                dto: NotificationAdminListResponseDto,
            }
        )
    );
}
