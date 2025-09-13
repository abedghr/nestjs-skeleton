import { Injectable } from '@nestjs/common';
import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import { DatabaseQueryContain } from 'src/common/database/decorators/database.decorator';
import {
    IDatabaseDocument,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { IUserJoinsDoc } from 'src/modules/user/interfaces/user.interface';
import { UserAbstractRepository } from 'src/modules/user/repository/repositories/abstract/user.abstract.repository';

@Injectable()
export class UserBaseService<
    Entity extends DatabaseEntityAbstract,
    EntityDoc extends IDatabaseDocument<Entity>,
> {
    constructor(
        protected readonly repository: UserAbstractRepository<Entity, EntityDoc>
    ) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<Array<EntityDoc & IUserJoinsDoc>> {
        return this.repository.findAll(find, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.repository.getTotal(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.findOneById<EntityDoc & IUserJoinsDoc>(
            _id,
            options
        );
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.findOne<EntityDoc & IUserJoinsDoc>(
            find,
            options
        );
    }

    async findOneWithJoins(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.findOne<EntityDoc & IUserJoinsDoc>(find, {
            ...options,
            join: true,
        });
    }

    async findOneByUsername(username: string, options?: IDatabaseOptions) {
        return this.repository.findOne<EntityDoc>({ username }, options);
    }

    async findOneByEmail(
        email: string,
        options?: IDatabaseOptions
    ): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.findOne<EntityDoc & IUserJoinsDoc>(
            { email },
            options
        );
    }

    async findAllWithJoins(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<Array<EntityDoc & IUserJoinsDoc>> {
        return this.repository.findAll<EntityDoc & IUserJoinsDoc>(find, {
            ...options,
            join: true,
        });
    }

    async findOneWithJoinsById(
        _id: string,
        options?: IDatabaseFindAllOptions
    ): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.findOneById<EntityDoc & IUserJoinsDoc>(_id, {
            ...options,
            join: true,
        });
    }

    async getTotalActive(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.repository.getTotal(
            { ...find, status: ENUM_USER_STATUS.ACTIVE },
            {
                ...options,
                join: this.repository._joinActive,
            }
        );
    }

    async findOneActiveById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.findOne<EntityDoc & IUserJoinsDoc>(
            { _id, status: ENUM_USER_STATUS.ACTIVE },
            {
                ...options,
                join: this.repository._joinActive,
            }
        );
    }

    async exists(
        find: Record<string, any>,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.repository.exists(find, options);
    }

    async existByUsername(
        username: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.repository.exists(
            DatabaseQueryContain('username', username, { fullWord: true }),
            { ...options }
        );
    }

    async join(repository: EntityDoc): Promise<EntityDoc & IUserJoinsDoc> {
        return this.repository.join(repository, this.repository._join);
    }

    async save(entityDocument: EntityDoc): Promise<EntityDoc> {
        try {
            return await this.repository.save(entityDocument);
        } catch (error: unknown) {
            throw error;
        }
    }
}
