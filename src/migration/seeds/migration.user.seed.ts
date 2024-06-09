import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { UserService } from 'src/modules/user/services/user.service';
import { USER_GENDER } from 'src/modules/user/constants/user.enum.constants';
import { UserDoc } from 'src/modules/user/repositories/entities/user.entity';

@Injectable()
export class MigrationUserSeed {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Command({
        command: 'seed:user',
        describe: 'seed users',
    })
    async seeds(): Promise<void> {
        const password = 'admin1234';
        const passwordHash = await this.authService.createPassword(password);
        const user1: Promise<UserDoc> = this.userService.create(
            {
                username: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                email: 'superadmin@gmail.com',
                password,
                mobileNumber: '962790714916',
                gender: USER_GENDER.MALE,
            },
            passwordHash
        );
        

        try {
            await Promise.all([user1]);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
