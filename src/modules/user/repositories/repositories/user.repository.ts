import { Injectable } from '@nestjs/common';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { Model } from 'mongoose';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/mongo/repositories/database.mongo.object-id.repository.abstract';

@Injectable()
export class UserRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    UserEntity,
    UserDoc
> {
    constructor(
        @DatabaseModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>
    ) {
        super(userModel);
    }
}
