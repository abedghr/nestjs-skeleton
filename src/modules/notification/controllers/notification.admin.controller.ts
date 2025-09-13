import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationCreateRequestDto } from '../dtos/request/notification.create.request.dto';
import { NotificationService } from '../services/notification.service';
import { AuthAdminJwtAccessProtected } from 'src/modules/auth/decorators/auth.jwt.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    PolicyAbilityProtected,
    PolicyRoleProtected,
} from 'src/modules/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_ROLE_TYPE,
    ENUM_POLICY_SUBJECT,
} from 'src/modules/policy/enums/policy.enum';
import { NotificationAdminListResponseDto } from 'src/modules/notification/dtos/response/notification.admin-list.response.dto';
import {
    NotificationAdminListDoc,
    NotificationTopicsListDoc,
} from 'src/modules/notification/docs/notification.admin.doc';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { NOTIFICATION_DEFAULT_AVAILABLE_SEARCH } from 'src/modules/notification/constants/notification.list.constant';
import { ENUM_FIREBASE_TOPICS } from 'src/modules/firebase/constants/firebase.enum';
import { NotificationDoc } from 'src/modules/notification/repository/entities/notification.entity';

@ApiTags('modules.admin.notification')
@Controller({
    version: '1',
    path: '/notification',
})
export class NotificationAdminController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly paginationService: PaginationService
    ) {}

    @NotificationAdminListDoc()
    @ResponsePaging('notification.list', {
        serialization: NotificationAdminListResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.NOTIFICATION,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery({
            availableSearch: NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
        })
        { _search, _limit, _offset, _order }: PaginationListDto
    ): Promise<IResponsePaging<any>> {
        const find: Record<string, any> = {
            ..._search,
        };
        const notifications = await this.notificationService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });
        const total: number = await this.notificationService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return { data: notifications, _pagination: { total, totalPage } };
    }

    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.NOTIFICATION,
        action: [ENUM_POLICY_ACTION.CREATE],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Post('/create')
    async create(
        @Body() dto: NotificationCreateRequestDto
    ): Promise<{ data: NotificationDoc }> {
        const created = await this.notificationService.create(dto);
        return { data: created };
    }

    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.NOTIFICATION,
        action: [ENUM_POLICY_ACTION.DELETE],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Delete('/:notificationId')
    async delete(
        @Param('notificationId') notificationId: string
    ): Promise<void> {
        await this.notificationService.delete({ _id: notificationId });
    }

    @NotificationTopicsListDoc()
    @Response('notification.topicsList', {
        serialization: NotificationAdminListResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.NOTIFICATION,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Get('/topics-list')
    async topicsList(): Promise<IResponse<any>> {
        return { data: Object.values(ENUM_FIREBASE_TOPICS) };
    }
}
