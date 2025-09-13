import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CountryEntity } from 'src/modules/country/repository/entities/country.entity';
import { RoleEntity } from 'src/modules/role/repository/entities/role.entity';
import { UserProviderDoc } from 'src/modules/user/repository/entities/user-provider.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { UserProviderEntity } from 'src/modules/user/repository/entities/user-provider.entity';

@Injectable()
export class UserProviderRepository extends DatabaseRepositoryAbstract<
    UserProviderEntity,
    UserProviderDoc
> {
    readonly _joinActive: PopulateOptions[] = [
        {
            path: 'role',
            localField: 'role',
            foreignField: '_id',
            model: RoleEntity.name,
            justOne: true,
            match: {
                isActive: true,
            },
        },
        {
            path: 'country',
            localField: 'country',
            foreignField: '_id',
            model: CountryEntity.name,
            justOne: true,
        },
    ];

    constructor(
        @DatabaseModel(UserEntity.name)
        private readonly userProviderModel: Model<UserProviderEntity>
    ) {
        super(userProviderModel.discriminators[UserProviderEntity.name], [
            {
                path: 'role',
                localField: 'role',
                foreignField: '_id',
                model: RoleEntity.name,
                justOne: true,
            },
            {
                path: 'country',
                localField: 'country',
                foreignField: '_id',
                model: CountryEntity.name,
                justOne: true,
            },
        ]);
    }
}
