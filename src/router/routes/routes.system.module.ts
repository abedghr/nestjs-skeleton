import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { BannerModule } from 'src/modules/banner/banner.module';
import { CountrySystemController } from 'src/modules/country/controllers/country.system.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { HealthSystemController } from 'src/modules/health/controllers/health.system.controller';
import { HealthModule } from 'src/modules/health/health.module';
import { RoleSystemController } from 'src/modules/role/controllers/role.system.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingSystemController } from 'src/modules/setting/controllers/setting.system.controller';
import { SettingModule } from 'src/modules/setting/setting.module';
import { StatisticsController } from 'src/modules/statistics/controllers/statistics.controller';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';
import { UserModule } from 'src/modules/user/user.module';
import { RequestModule } from 'src/common/request/request.module';

@Module({
    controllers: [
        HealthSystemController,
        SettingSystemController,
        CountrySystemController,
        RoleSystemController,
        StatisticsController,
    ],
    providers: [],
    exports: [],
    imports: [
        HealthModule,
        TerminusModule,
        SettingModule,
        CountryModule,
        BannerModule,
        UserModule,
        RoleModule,
        StatisticsModule,
        RequestModule.forRoot(),
    ],
})
export class RoutesSystemModule {}
