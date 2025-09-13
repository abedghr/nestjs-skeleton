import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_PROVIDER_SUBJECT,
    ENUM_POLICY_ROLE_TYPE,
    ENUM_POLICY_SUBJECT,
} from 'src/modules/policy/enums/policy.enum';
import { RoleService } from 'src/modules/role/services/role.service';
import { RoleCreateRequestDto } from 'src/modules/role/dtos/request/role.create.request.dto';

@Injectable()
export class MigrationRoleSeed {
    constructor(private readonly roleService: RoleService) {}

    @Command({
        command: 'seed:role',
        describe: 'seed roles',
    })
    async seeds(): Promise<void> {
        const data: RoleCreateRequestDto[] = [
            {
                name: 'superadmin',
                type: ENUM_POLICY_ROLE_TYPE.SUPER_ADMIN,
                permissions: Object.values(ENUM_POLICY_SUBJECT).map(val => ({
                    subject: val,
                    action: [ENUM_POLICY_ACTION.MANAGE],
                })),
            },
            {
                name: 'provider',
                type: ENUM_POLICY_ROLE_TYPE.PROVIDER,
                permissions: Object.values(ENUM_POLICY_SUBJECT)
                    .filter(val =>
                        Object.values(ENUM_POLICY_PROVIDER_SUBJECT).includes(
                            val as unknown as ENUM_POLICY_PROVIDER_SUBJECT
                        )
                    )
                    .map(val => ({
                        subject: val,
                        action: [ENUM_POLICY_ACTION.MANAGE],
                    })),
            },
            {
                name: 'customer',
                type: ENUM_POLICY_ROLE_TYPE.CUSTOMER,
                permissions: [],
            },
        ];

        try {
            await this.roleService.createMany(data);
        } catch (err: any) {
            throw new Error(err);
        }

        return;
    }

    @Command({
        command: 'remove:role',
        describe: 'remove roles',
    })
    async remove(): Promise<void> {
        try {
            await this.roleService.deleteMany({});
        } catch (err: any) {
            throw new Error(err);
        }

        return;
    }
}
