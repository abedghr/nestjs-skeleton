import {
    Controller,
    Get,
    NotFoundException,
    Query,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestRequiredPipe } from 'src/common/request/pipes/request.required.pipe';
import { Response } from 'src/common/response/decorators/response.decorator';
import { CountryService } from 'src/modules/country/services/country.service';
import { SettingService } from 'src/modules/setting/services/setting.service';
import { StatisticsAdminDoc } from 'src/modules/statistics/docs/health.system.doc';
import { StatisticsAdminResponseDto } from 'src/modules/statistics/dtos/response/statistics-admin.response.dto';
import { StatisticsAdminService } from 'src/modules/statistics/services/statistics-admin.service';

@ApiTags('modules.system.statistics')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/statistics',
})
export class StatisticsController {
    constructor(
        private readonly statisticsAdminService: StatisticsAdminService,
        private readonly countryService: CountryService,
        private readonly settingService: SettingService
    ) {}

    @StatisticsAdminDoc()
    @Response('statistics.admin', {
        serialization: StatisticsAdminResponseDto,
    })
    @Get('/super-admin')
    async superAdminStatistics(
        @Query('country', RequestRequiredPipe) country: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const countryDetails = await this.countryService.findOneById(country);

        if (countryDetails == null) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'country.error.notFound',
            });
        }

        const currency = await this.settingService.getCurrencyByCountryCode(
            countryDetails.alpha2Code,
            false
        );

        const result = await this.statisticsAdminService.getAdminStatistics({
            country,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });

        return {
            data: result,
            _metadata: {
                customProperty: {
                    currency,
                },
            },
        };
    }
}
