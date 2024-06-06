import { Injectable } from '@nestjs/common';
import { DatabaseModel } from 'src/common/database/sql/decorators/database.decorator';
import { Repository } from 'typeorm';
import { DatabaseSQLIdRepositoryAbstract } from 'src/common/database/sql/repositories/database.sql.id.repository.abstract';
import { MemberEntity } from '../entities/member.sql.entity';

@Injectable()
export class MemberRepository extends DatabaseSQLIdRepositoryAbstract<MemberEntity> {
    constructor(
        @DatabaseModel(MemberEntity)
        private memberEntity: Repository<MemberEntity>
    ) {
        super(memberEntity);
    }
}
