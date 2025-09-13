import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestRequiredPipe } from 'src/common/request/pipes/request.required.pipe';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { AuthAdminJwtAccessProtected } from 'src/modules/auth/decorators/auth.jwt.decorator';
import {
    CategoryAdminChangeStatusDoc,
    CategoryAdminCreateDoc,
    CategoryAdminListDoc,
    CategoryAdminUpdateDoc,
    CategoryDetailsDoc,
} from 'src/modules/categories/docs/category.admin.doc';
import { CategoryChangeStatusRequestDto } from 'src/modules/categories/dtos/request/category.change-status.request.dto';
import { CategoryCreateRequestDto } from 'src/modules/categories/dtos/request/category.create.request.dto';
import { CategoryUpdateRequestDto } from 'src/modules/categories/dtos/request/category.update.request.dto';
import { CategoryAdminListResponseDto } from 'src/modules/categories/dtos/response/category.admin-list.response.dto';
import { CategoryGetResponseDto } from 'src/modules/categories/dtos/response/category.get.response.dto';
import { ENUM_CATEGORY_STATUS_CODE_ERROR } from 'src/modules/categories/enums/category.status-code.enum';
import { CategoryService } from 'src/modules/categories/services/category.service';
import {
    PolicyAbilityProtected,
    PolicyRoleProtected,
} from 'src/modules/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_ROLE_TYPE,
    ENUM_POLICY_SUBJECT,
} from 'src/modules/policy/enums/policy.enum';

@ApiTags('modules.admin.category')
@Controller({
    version: '1',
    path: '/category',
})
export class CategoryAdminController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly paginationService: PaginationService
    ) {}

    @CategoryAdminCreateDoc()
    @Response('category.create')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.CATEGORY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @PolicyRoleProtected(
        ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
        ENUM_POLICY_ROLE_TYPE.PROVIDER
    )
    @AuthAdminJwtAccessProtected(true)
    @HttpCode(HttpStatus.CREATED)
    @Post('/create')
    async create(@Body() body: CategoryCreateRequestDto): Promise<void> {
        const { name, order } = body;
        await this.categoryService.create({
            name,
            order,
        });
        return;
    }

    @CategoryAdminUpdateDoc()
    @Response('category.update')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.CATEGORY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @PolicyRoleProtected(
        ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
        ENUM_POLICY_ROLE_TYPE.PROVIDER
    )
    @AuthAdminJwtAccessProtected(true)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Put('/update/:category')
    async update(
        @Param('category', RequestRequiredPipe) category: string,
        @Body() body: CategoryUpdateRequestDto
    ): Promise<void> {
        const { name, order } = body;
        await this.categoryService.update(category, {
            name,
            order,
        });
        return;
    }

    @CategoryAdminChangeStatusDoc()
    @Response('category.changeStatus')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.CATEGORY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @PolicyRoleProtected(
        ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
        ENUM_POLICY_ROLE_TYPE.PROVIDER
    )
    @AuthAdminJwtAccessProtected(true)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('change-status')
    async changeStatus(
        @Body() body: CategoryChangeStatusRequestDto
    ): Promise<void> {
        const { category, status } = body;
        const categoryDetails =
            await this.categoryService.findOneById(category);
        if (!categoryDetails) {
            throw new NotFoundException({
                statusCode: ENUM_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'category.error.notFound',
            });
        }

        await this.categoryService.changeStatus(categoryDetails, status);
        return;
    }

    @CategoryAdminListDoc()
    @ResponsePaging('category.list', {
        serialization: CategoryAdminListResponseDto,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.CATEGORY,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @PolicyRoleProtected(
        ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
        ENUM_POLICY_ROLE_TYPE.PROVIDER
    )
    @AuthAdminJwtAccessProtected(true)
    @Get('list')
    async list(
        @PaginationQuery({})
        { _limit, _offset, _order }: PaginationListDto
    ): Promise<IResponsePaging<any>> {
        try {
            const find: Record<string, any> = {};
            const result = await this.categoryService.findAll(find, {
                paging: {
                    limit: _limit,
                    offset: _offset,
                },
                order: _order,
                join: true,
            });
            const total: number = await this.categoryService.getTotal(find);
            const totalPage: number = this.paginationService.totalPage(
                total,
                _limit
            );
            return {
                _pagination: { total, totalPage },
                data: result,
            };
        } catch (err: any) {
            throw err;
        }
    }

    @CategoryDetailsDoc()
    @AuthAdminJwtAccessProtected()
    @Response('category.details', {
        serialization: CategoryGetResponseDto,
    })
    @Get('/:category/get')
    async details(
        @Param('category', RequestRequiredPipe) category: string
    ): Promise<IResponse<any>> {
        try {
            const result = await this.categoryService.findOneById(category);
            return {
                data: result,
            };
        } catch (err: any) {
            throw err;
        }
    }
}
