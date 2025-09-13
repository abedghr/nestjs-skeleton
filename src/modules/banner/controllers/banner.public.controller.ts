import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { BannerDoc } from 'src/modules/banner/repository/entities/banner.entity';
import { BannerService } from 'src/modules/banner/services/banner.service';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/enums/pagination.enum';
import { BannerListDoc } from 'src/modules/banner/docs/banner.public.doc';
import { BannerListResponseDto } from 'src/modules/banner/dtos/response/banner.list.response.dto';
import { HeaderUserLocation } from 'src/modules/country/decorators/header-country-by-code.decorator';
import { LongitudeAndLatitudeParsePipe } from 'src/modules/country/pipes/location.parse.pipe';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';

@ApiTags('modules.public.banner')
@Controller({
    version: '1',
    path: '/banner',
})
export class BannerPublicController {
    constructor(
        private readonly bannerService: BannerService,
        private readonly paginationService: PaginationService
    ) {}

    @BannerListDoc()
    @ResponsePaging('banner.list', {
        serialization: BannerListResponseDto,
    })
    @Get('/list')
    async list(
        @PaginationQuery({})
        { _limit, _offset }: PaginationListDto,
        @HeaderUserLocation(LongitudeAndLatitudeParsePipe)
        location: { longitude: number; latitude: number; country: CountryDoc }
    ): Promise<IResponsePaging<BannerDoc>> {
        const find: Record<string, any> = {
            country: location.country._id,
            isActive: true,
        };
        const banners: BannerDoc[] = await this.bannerService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: {
                createdAt: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
            },
        });
        const total: number = await this.bannerService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: banners,
        };
    }
}
