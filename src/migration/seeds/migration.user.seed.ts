import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { RoleDoc } from 'src/modules/role/repository/entities/role.entity';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/enums/user.enum';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';
import { CountryService } from 'src/modules/country/services/country.service';
import { ENUM_POLICY_ROLE_TYPE } from 'src/modules/policy/enums/policy.enum';
import { UserAuthService } from 'src/modules/user/services/user.auth.service';
import { UserAdminService } from 'src/modules/user/services/user.admin.service';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';

@Injectable()
export class MigrationUserSeed {
    constructor(
        private readonly authService: AuthService,
        private readonly userAdminService: UserAdminService,
        private readonly userAuthService: UserAuthService,
        private readonly roleService: RoleService,
        private readonly countryService: CountryService
    ) {}

    @Command({
        command: 'seed:user',
        describe: 'seed users',
    })
    async seeds(): Promise<void> {
        const passwordHash = await this.authService.createPassword(
            this.authService.getDefaultSuperAdminPassword()
        );
        const superAdminRole: RoleDoc = await this.roleService.findOneByType(
            ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN
        );
        const country: CountryDoc = await this.countryService.findOneByAlpha2(
            ENUM_AVAILABLE_COUNTRIES.JO
        );

        try {
            await this.userAuthService.create(
                {
                    role: superAdminRole._id,
                    roleType: ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
                    mobileNumber: '+962790000000',
                    username: 'superadmin',
                    firstName: 'superadmin',
                    email: 'superadmin@glowapp.com',
                    country: country._id,
                },
                passwordHash,
                ENUM_USER_SIGN_UP_FROM.SEED
            );
            
            await this.userAuthService.create(
                {
                    role: superAdminRole._id,
                    roleType: ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
                    mobileNumber: '+962790000022',
                    username: 'superadmin2',
                    firstName: 'superadmin2',
                    email: 'superadmin2@glowapp.com',
                    country: country._id,
                },
                passwordHash,
                ENUM_USER_SIGN_UP_FROM.SEED
            );

            // Add random user
            // const randomUser = Array(30)
            //     .fill(0)
            //     .map(() =>
            //         this.userService.create(
            //             {
            //                 role: userRole._id,
            //                 name: faker.person.fullName(),
            //                 email: faker.internet.email(),
            //                 country: country._id,
            //             },
            //             passwordHash,
            //             ENUM_USER_SIGN_UP_FROM.SEED
            //         )
            //     );

            // await Promise.all(randomUser);
        } catch (err: any) {
            throw new Error(err);
        }

        return;
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
            await this.userAdminService.deleteMany({});
        } catch (err: any) {
            throw new Error(err);
        }

        return;
    }
}
