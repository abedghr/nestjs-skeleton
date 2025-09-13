import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/enums/doc.enum';
import { NotificationSaveFcmRequestDto } from 'src/modules/notification/dtos/request/notification.save-fcm.request.dto';

export function NotificationUserSaveFcmDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Save fcm notification',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: NotificationSaveFcmRequestDto,
        }),
        DocResponse('notification.saveFcm', {
            httpStatus: HttpStatus.NO_CONTENT,
        })
    );
}
