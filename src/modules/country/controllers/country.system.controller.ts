import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { COUNTRY_DEFAULT_AVAILABLE_SEARCH } from 'src/modules/country/constants/country.list.constant';
import { CountryListResponseDto } from 'src/modules/country/dtos/response/country.list.response.dto';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';
import { CountryService } from 'src/modules/country/services/country.service';
import { CountrySystemListDoc } from 'src/modules/country/docs/country.system.doc';

@ApiTags('modules.system.country')
@Controller({
    version: '1',
    path: '/country',
})
export class CountrySystemController {
    constructor(
        private readonly countryService: CountryService,
        private readonly paginationService: PaginationService
    ) {}

    @CountrySystemListDoc()
    @ResponsePaging('country.list', {
        serialization: CountryListResponseDto,
    })
    @Get('/list')
    async list(
        @PaginationQuery({
            availableSearch: COUNTRY_DEFAULT_AVAILABLE_SEARCH,
        })
        { _search, _limit, _offset, _order }: PaginationListDto
    ) {
        const find: Record<string, any> = {
            ..._search,
            isActive: true,
        };

        const countries: CountryDoc[] = await this.countryService.findAll(
            find,
            {
                paging: {
                    limit: _limit,
                    offset: _offset,
                },
                order: _order,
            }
        );
        const total: number = await this.countryService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: countries,
        };
    }
}
