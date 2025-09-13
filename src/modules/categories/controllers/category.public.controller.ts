import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import {
    AuthJwtPayload,
    AuthJwtCustomerOptionalProtected,
} from 'src/modules/auth/decorators/auth.jwt.decorator';
import { AuthJwtAccessPayloadDto } from 'src/modules/auth/dtos/jwt/auth.jwt.access-payload.dto';
import { CategoryWithItemsListDoc } from 'src/modules/categories/docs/category.doc';
import { CategoryWithItemsListResponseDto } from 'src/modules/categories/dtos/response/category-with-items.list.response.dto';

@ApiTags('modules.public.category')
@Controller({
    version: '1',
    path: '/category',
})
export class CategoryPublicController {
    constructor() {}

    @CategoryWithItemsListDoc()
    @Response('categoryWithItems.list', {
        serialization: CategoryWithItemsListResponseDto,
    })
    @AuthJwtCustomerOptionalProtected()
    @Get('list')
    async list(
        @AuthJwtPayload<AuthJwtAccessPayloadDto>()
        user: AuthJwtAccessPayloadDto | null
    ): Promise<IResponse<any>> {
        console.log(user);
        return {
            data: [],
        };
    }
}
