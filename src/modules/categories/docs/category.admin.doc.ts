import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/enums/doc.enum';
import {
    CategoryDocParamsId,
    CategoryDocQueryStatus,
} from 'src/modules/categories/constants/category.doc.constant';
import { CategoryChangeStatusRequestDto } from 'src/modules/categories/dtos/request/category.change-status.request.dto';
import { CategoryCreateRequestDto } from 'src/modules/categories/dtos/request/category.create.request.dto';
import { CategoryUpdateRequestDto } from 'src/modules/categories/dtos/request/category.update.request.dto';
import { CategoryGetResponseDto } from 'src/modules/categories/dtos/response/category.get.response.dto';

export function CategoryAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'create category',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: CategoryCreateRequestDto,
        }),
        DocResponse('category.create', {
            httpStatus: HttpStatus.NO_CONTENT,
        })
    );
}

export function CategoryAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'update category',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            params: [...CategoryDocParamsId],
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: CategoryUpdateRequestDto,
        }),
        DocResponse('category.update', {
            httpStatus: HttpStatus.NO_CONTENT,
        })
    );
}

export function CategoryAdminChangeStatusDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Change category status',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            dto: CategoryChangeStatusRequestDto,
        }),
        DocResponse('category.changeStatus', {
            httpStatus: HttpStatus.NO_CONTENT,
        })
    );
}

export function CategoryAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get categories list',
        }),
        DocRequest({
            queries: [...CategoryDocQueryStatus],
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<CategoryGetResponseDto>('category.list', {
            dto: CategoryGetResponseDto,
        })
    );
}

export function CategoryDetailsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get category details',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            params: [...CategoryDocParamsId],
        }),
        DocResponse<CategoryGetResponseDto>('category.details', {
            dto: CategoryGetResponseDto,
        })
    );
}
