import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entities/member.sql.entity';
import { MemberRepository } from './repositories/member.repository';

@Module({
    providers: [MemberRepository],
    exports: [MemberRepository],
    controllers: [],
    imports: [TypeOrmModule.forFeature([MemberEntity])],
})
export class MemberRepositoryModule {}
