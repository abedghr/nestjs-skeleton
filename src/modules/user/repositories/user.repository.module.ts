import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { UserEntity, UserSchema } from './entities/user.entity';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/mongo/constants/database.constant';

@Module({
    providers: [UserRepository],
    exports: [UserRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: UserEntity.name,
                    schema: UserSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class UserRepositoryModule {}
