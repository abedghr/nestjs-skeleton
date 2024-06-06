import { DeepPartial, FindOneOptions, Repository } from "typeorm";

export abstract class DatabaseSQLIdRepositoryAbstract<Entity> {
    protected _repository: Repository<Entity>;

    constructor(
        repository: Repository<Entity>,
    ) {
        this._repository = repository;
    }

    get repository(): Repository<Entity> {
        return this._repository;
    }

    async findOne(
        find: FindOneOptions<Entity>,
    ): Promise<Entity | null> {
        return await this._repository.findOne(find)
    }
    
    async create(
        data: DeepPartial<Entity>,
    ): Promise<Entity> {
        const create: Entity = this._repository.create(data)
        return this._repository.save(create);
    }
}
