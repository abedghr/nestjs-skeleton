import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoryModule } from 'src/modules/categories/category.module';
import { CountryModule } from 'src/modules/country/country.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { NotificationUserController } from 'src/modules/notification/controllers/notification.user.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [NotificationUserController],
    providers: [],
    exports: [],
    imports: [
        SettingModule,
        CountryModule,
        CategoryModule,
        UserModule,
        AuthModule,
        FirebaseModule,
        RoleModule,
        MessagingModule,
    ],
})
export class RoutesUserModule {}
