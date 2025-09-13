import { applyDecorators } from '@nestjs/common';
import { Doc, DocResponse } from 'src/common/doc/decorators/doc.decorator';
import { StatisticsAdminResponseDto } from 'src/modules/statistics/dtos/response/statistics-admin.response.dto';

export function StatisticsAdminDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'statistics admin api',
        }),
        DocResponse<StatisticsAdminResponseDto>('statistics.admin', {
            dto: StatisticsAdminResponseDto,
        })
    );
}
