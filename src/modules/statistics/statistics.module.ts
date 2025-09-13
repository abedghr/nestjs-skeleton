import { Module } from '@nestjs/common';
import { CountryModule } from 'src/modules/country/country.module';
import { SettingModule } from 'src/modules/setting/setting.module';
import { StatisticsAdminService } from 'src/modules/statistics/services/statistics-admin.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    providers: [StatisticsAdminService],
    exports: [StatisticsAdminService],
    imports: [UserModule, CountryModule, SettingModule],
})
export class StatisticsModule {}
