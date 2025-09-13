import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepositoryModule } from './repository/user.repository.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserAuthService } from './services/user.auth.service';
import { RoleModule } from '../role/role.module';
import { CountryModule } from '../country/country.module';
import { UserAdminService } from './services/user.admin.service';
import { UserCustomerService } from './services/user.customer.service';
import { BannerModule } from '../banner/banner.module';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
    imports: [
        UserRepositoryModule,
        FirebaseModule,
        RoleModule,
        CountryModule,
        BannerModule,
        EmailModule,
    ],
    exports: [
        UserService,
        UserCustomerService,
        UserAuthService,
        UserAdminService,
    ],
    providers: [
        UserService,
        UserCustomerService,
        UserAuthService,
        UserAdminService,
    ],
})
export class UserModule {}
