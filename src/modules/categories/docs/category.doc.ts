import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { CategoryDocParamsId } from 'src/modules/categories/constants/category.doc.constant';
import { CategoryWithItemsListResponseDto } from 'src/modules/categories/dtos/response/category-with-items.list.response.dto';

export function CategoryWithItemsListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get categories with items list',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            params: [...CategoryDocParamsId],
        }),
        DocResponse<CategoryWithItemsListResponseDto>(
            'categoryWithItems.list',
            {
                dto: CategoryWithItemsListResponseDto,
            }
        )
    );
}
