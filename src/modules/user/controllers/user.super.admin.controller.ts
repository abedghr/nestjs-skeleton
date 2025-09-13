import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryFilterEqual,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';
import {
    PolicyAbilityProtected,
    PolicyRoleProtected,
} from 'src/modules/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_ROLE_TYPE,
    ENUM_POLICY_SUBJECT,
} from 'src/modules/policy/enums/policy.enum';
import { AuthAdminJwtAccessProtected, AuthJwtPayload } from 'src/modules/auth/decorators/auth.jwt.decorator';
import { RequestRequiredPipe } from 'src/common/request/pipes/request.required.pipe';
import {
    UserAdminGetDoc,
    UserAdminChangeStatusDoc,
    UserAdminListDoc,
    UserAdminUpdateDoc,
    UserAdminProfileDoc,
} from 'src/modules/user/docs/user.admin.doc';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { UserParsePipe } from 'src/modules/user/pipes/user.parse.pipe';
import {
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_STATUS,
} from 'src/modules/user/constants/user.list.constant';
import { UserNotSelfPipe } from 'src/modules/user/pipes/user.not-self.pipe';
import { UserUpdateRequestDto } from 'src/modules/user/dtos/request/user.update.request.dto';
import { UserAdminService } from 'src/modules/user/services/user.admin.service';
import { SuperUserListResponseDto } from 'src/modules/user/dtos/response/user.super-list.response.dto';
import { SuperUserProfileResponseDto } from 'src/modules/user/dtos/response/user.super-profile.response.dto';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/enums/user.status-code.enum';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { UserAuthService } from '../services/user.auth.service';

@ApiTags('modules.admin.super')
@Controller({
    version: '1',
    path: '/super/user',
})
export class UserSuperAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly userAdminService: UserAdminService,
        private readonly roleService: RoleService,
        private readonly userAuthService: UserAuthService
    ) {}

    @UserAdminListDoc()
    @ResponsePaging('user.list', {
        serialization: SuperUserListResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Get('/list')
    async list(
        @AuthJwtPayload<AuthJwtAccessPayloadDto>()
        viewer: AuthJwtAccessPayloadDto,
        @PaginationQuery({
            availableSearch: USER_DEFAULT_AVAILABLE_SEARCH,
        })
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInEnum(
            'status',
            USER_DEFAULT_STATUS,
            ENUM_USER_STATUS
        )
        status: Record<string, any>,
        @PaginationQueryFilterEqual('role')
        role: Record<string, any>,
        @PaginationQueryFilterEqual('country')
        country: Record<string, any>,
        @PaginationQueryFilterEqual('mobileNumber')
        mobileNumber: Record<string, any>
    ) {
        const find: Record<string, any> = {
            ..._search,
            ...status,
            ...country,
            ...mobileNumber,
            _id: { $ne: viewer._id },
        };        

        if (role != null) {
            const roleDetails = await this.roleService.findOne({
                type: role.role,
            });
            if (!roleDetails) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
                    message: 'auth.error.notFound',
                });
            }
            find.role = roleDetails._id;
        }

        const users = await this.userAdminService.findAllWithJoins(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });
        const total: number = await this.userAdminService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );        

        return {
            _pagination: { total, totalPage },
            data: users,
        };
    }

    @UserAdminGetDoc()
    @Response('user.get', {
        serialization: SuperUserProfileResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Get('/get/:user')
    async get(
        @Param('user', RequestRequiredPipe, UserParsePipe) user: UserDoc
    ) {
        const userWithRole = await this.userAdminService.join(user);

        return { data: userWithRole };
    }

    @UserAdminUpdateDoc()
    @Response('user.update')
    @HttpCode(HttpStatus.NO_CONTENT)
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Put('/update/:user')
    async update(
        @Param('user', RequestRequiredPipe, UserParsePipe, UserNotSelfPipe)
        user: UserDoc,
        @Body()
        {
            email,
            firstName,
            lastName,
            gender,
            dateOfBirth,
        }: UserUpdateRequestDto
    ): Promise<void> {
        try {
            await this.userAdminService.update(user, {
                email,
                firstName,
                lastName,
                gender,
                dateOfBirth,
            });
            return;
        } catch (err: any) {
            throw err;
        }
    }

    @UserAdminChangeStatusDoc()
    @Response('user.changeStatus')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @AuthAdminJwtAccessProtected()
    @Patch('/update-status/:user')
    async changeStatus(
        @Body()
        { status }: { status: ENUM_USER_STATUS },
        @Param('user', RequestRequiredPipe, UserParsePipe, UserNotSelfPipe)
        user: UserDoc
    ): Promise<void> {
        try {
            await this.userAdminService.changeUserStatus({ user, status });
            return;
        } catch (err: any) {
            throw err;
        }
    }

    @UserAdminProfileDoc()
    @Response('user.profile', {
        serialization: SuperUserProfileResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN)
    @AuthAdminJwtAccessProtected()
    @Get('/profile')
    async profile(
        @AuthJwtPayload<AuthJwtAccessPayloadDto>()
        viewer: AuthJwtAccessPayloadDto,
    ) {
        const user = await this.userAdminService.findOneById(viewer._id);
        const userWithRole = await this.userAdminService.join(user);
        return { data: userWithRole };
    }
}
