import { Injectable } from '@nestjs/common';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class StatisticsAdminService {
    constructor(private readonly userService: UserService) {}

    async getAdminStatistics({
        country,
        startDate,
        endDate,
    }: {
        country: string;
        startDate: Date;
        endDate: Date;
    }) {
        console.log(startDate, endDate);
        // Get total users count
        const totalUsers = await this.getTotalUsers(country);

        return {
            totalUsers,
        };
    }

    async getTotalUsers(countryId: string): Promise<number> {
        return this.userService.getTotal({
            country: countryId,
            status: ENUM_USER_STATUS.ACTIVE,
        });
    }
}
