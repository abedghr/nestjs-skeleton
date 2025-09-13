import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/enums/doc.enum';
import { BannerDocParamsId } from 'src/modules/banner/constants/banner.doc.constant';
// import { BannerCreateRequestDto } from 'src/modules/banner/dtos/request/banner.create.request.dto';
import { BannerGetResponseDto } from 'src/modules/banner/dtos/response/banner.get.response.dto';
import { BannerAdminListResponseDto } from 'src/modules/banner/dtos/response/banner.admin-list.response.dto';

export function BannerAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get all of banners',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<BannerAdminListResponseDto>('banner.list', {
            dto: BannerAdminListResponseDto,
        })
    );
}

export function BannerAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get detail a banner',
        }),
        DocRequest({
            params: BannerDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<BannerGetResponseDto>('banner.get', {
            dto: BannerGetResponseDto,
        })
    );
}
export function BannerAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new banner',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
        }),
        DocResponse<BannerGetResponseDto>('banner.create', {
            dto: BannerGetResponseDto,
        })
    );
}

export function BannerAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update an existing banner',
        }),
        DocRequest({
            params: BannerDocParamsId,
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<BannerGetResponseDto>('banner.update', {
            dto: BannerGetResponseDto, // The response is typically the updated banner
        })
    );
}
