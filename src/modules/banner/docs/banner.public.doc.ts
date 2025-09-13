import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { BannerAdminListResponseDto } from 'src/modules/banner/dtos/response/banner.admin-list.response.dto';

export function BannerListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'get active banners list',
            extra: {
                location: true,
            },
        }),
        DocResponsePaging<BannerAdminListResponseDto>('banner.list', {
            dto: BannerAdminListResponseDto,
        })
    );
}
