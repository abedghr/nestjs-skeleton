import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StatisticsAdminUserResponseDto {
    @Expose()
    @ApiProperty()
    _id: string;

    @Expose()
    @ApiProperty()
    userName: string;

    @Expose()
    @ApiProperty()
    email: string;

    @Expose()
    @ApiProperty()
    totalOrders: number;

    @Expose()
    @ApiProperty()
    totalSpent: number;
}
