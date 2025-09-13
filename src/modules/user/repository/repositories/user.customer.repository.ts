import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CountryEntity } from 'src/modules/country/repository/entities/country.entity';
import { RoleEntity } from 'src/modules/role/repository/entities/role.entity';
import { UserCustomerEntity } from 'src/modules/user/repository/entities/user-customer.entity';
import { UserCustomerDoc } from 'src/modules/user/repository/entities/user-customer.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

@Injectable()
export class UserCustomerRepository extends DatabaseRepositoryAbstract<
    UserCustomerEntity,
    UserCustomerDoc
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
        private readonly userCustomerModel: Model<UserCustomerEntity>
    ) {
        super(userCustomerModel.discriminators[UserCustomerEntity.name], [
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
