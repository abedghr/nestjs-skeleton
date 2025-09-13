import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthPublicController } from 'src/modules/auth/controllers/auth.public.controller';
import { BannerModule } from 'src/modules/banner/banner.module';
import { BannerPublicController } from 'src/modules/banner/controllers/banner.public.controller';
import { CategoryModule } from 'src/modules/categories/category.module';
import { CategoryPublicController } from 'src/modules/categories/controllers/category.public.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { EmailModule } from 'src/modules/email/email.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserModule } from 'src/modules/user/user.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { NotificationPublicController } from 'src/modules/notification/controllers/notification.public.controller';

@Module({
    controllers: [
        AuthPublicController,
        BannerPublicController,
        CategoryPublicController,
        NotificationPublicController,
    ],
    providers: [],
    exports: [],
    imports: [
        SettingModule,
        UserModule,
        CategoryModule,
        AuthModule,
        RoleModule,
        EmailModule,
        FirebaseModule,
        CountryModule,
        BannerModule,
        NotificationModule,
    ],
})
export class RoutesPublicModule {}
