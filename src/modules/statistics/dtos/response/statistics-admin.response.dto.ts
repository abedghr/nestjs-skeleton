import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { StatisticsAdminUserResponseDto } from 'src/modules/statistics/dtos/response/statistics-admin-user.response.dto';

export class StatisticsAdminResponseDto {
    @Expose()
    @ApiProperty()
    totalUsers: number;

    @Expose()
    @ApiProperty()
    @Type(() => StatisticsAdminUserResponseDto)
    topUsers: StatisticsAdminUserResponseDto[];
}
