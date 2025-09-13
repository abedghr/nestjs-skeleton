import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    PaginationQuery,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ENUM_POLICY_ROLE_TYPE } from 'src/modules/policy/enums/policy.enum';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import {
    ROLE_DEFAULT_AVAILABLE_SEARCH,
    ROLE_DEFAULT_POLICY_ROLE_TYPE,
} from 'src/modules/role/constants/role.list.constant';
import { RoleDoc } from 'src/modules/role/repository/entities/role.entity';
import { RoleService } from 'src/modules/role/services/role.service';
import { RoleSystemListDoc } from 'src/modules/role/docs/role.system.controller';

@ApiTags('modules.system.role')
@Controller({
    version: '1',
    path: '/role',
})
export class RoleSystemController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly roleService: RoleService
    ) {}

    @RoleSystemListDoc()
    @ResponsePaging('role.list')
    @Get('/list')
    async list(
        @PaginationQuery({ availableSearch: ROLE_DEFAULT_AVAILABLE_SEARCH })
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInEnum(
            'type',
            ROLE_DEFAULT_POLICY_ROLE_TYPE,
            ENUM_POLICY_ROLE_TYPE
        )
        type: Record<string, any>
    ) {
        const find: Record<string, any> = {
            ..._search,
            ...type,
        };

        const roles: RoleDoc[] = await this.roleService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });

        const total: number = await this.roleService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: roles,
        };
    }
}
