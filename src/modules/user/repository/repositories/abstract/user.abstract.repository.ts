import { Model, PopulateOptions } from 'mongoose';
import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { CountryEntity } from 'src/modules/country/repository/entities/country.entity';
import { RoleEntity } from 'src/modules/role/repository/entities/role.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

export abstract class UserAbstractRepository<
    Entity extends DatabaseEntityAbstract,
    Doc extends IDatabaseDocument<Entity>,
> extends DatabaseRepositoryAbstract<Entity, Doc> {
    constructor(
        @DatabaseModel(UserEntity.name)
        model: Model<Entity>,
        options?: PopulateOptions | (string | PopulateOptions)[]
    ) {
        super(model, options);
    }
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
}
