import { Module } from '@nestjs/common';
import { RequestModule } from 'src/common/request/request.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AwsModule } from 'src/modules/aws/aws.module';
import { BannerModule } from 'src/modules/banner/banner.module';
import { BannerAdminController } from 'src/modules/banner/controllers/banner.admin.controller';
import { CategoryModule } from 'src/modules/categories/category.module';
import { CategoryAdminController } from 'src/modules/categories/controllers/category.admin.controller';
import { CountryAdminController } from 'src/modules/country/controllers/country.admin.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { EmailModule } from 'src/modules/email/email.module';
import { NotificationAdminController } from 'src/modules/notification/controllers/notification.admin.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { RoleAdminController } from 'src/modules/role/controllers/role.admin.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingAdminController } from 'src/modules/setting/controllers/setting.admin.controller';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserSuperAdminController } from 'src/modules/user/controllers/user.super.admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [
        SettingAdminController,
        RoleAdminController,
        UserSuperAdminController,
        CountryAdminController,
        BannerAdminController,
        CategoryAdminController,
        NotificationAdminController,
    ],
    providers: [],
    exports: [],
    imports: [
        SettingModule,
        RoleModule,
        UserModule,
        AuthModule,
        EmailModule,
        CountryModule,
        BannerModule,
        NotificationModule,
        AwsModule,
        CategoryModule,
        RequestModule.forRoot(),
    ],
})
export class RoutesAdminModule {}
