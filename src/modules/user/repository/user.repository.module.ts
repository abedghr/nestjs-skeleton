import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import {
    UserAuthEntity,
    UserAuthSchema,
} from 'src/modules/user/repository/entities/user-auth.entity';
import {
    UserCustomerEntity,
    UserCustomerSchema,
} from 'src/modules/user/repository/entities/user-customer.entity';
import {
    UserProviderEntity,
    UserProviderSchema,
} from 'src/modules/user/repository/entities/user-provider.entity';
import {
    UserEntity,
    UserSchema,
} from 'src/modules/user/repository/entities/user.entity';
import { UserAuthRepository } from 'src/modules/user/repository/repositories/user-auth.repository';
import { UserCustomerRepository } from 'src/modules/user/repository/repositories/user.customer.repository';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';
import { UserProviderRepository } from 'src/modules/user/repository/repositories/user.provider.repository';

@Module({
    providers: [
        UserRepository,
        UserAuthRepository,
        UserCustomerRepository,
        UserProviderRepository,
    ],
    exports: [
        UserRepository,
        UserAuthRepository,
        UserCustomerRepository,
        UserProviderRepository,
    ],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: UserEntity.name,
                    schema: UserSchema,
                    discriminators: [
                        {
                            name: UserAuthEntity.name,
                            schema: UserAuthSchema,
                        },
                        {
                            name: UserCustomerEntity.name,
                            schema: UserCustomerSchema,
                        },
                        {
                            name: UserProviderEntity.name,
                            schema: UserProviderSchema,
                        },
                    ],
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class UserRepositoryModule {}
