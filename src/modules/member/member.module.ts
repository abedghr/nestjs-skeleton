import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { MemberRepositoryModule } from './repositories/member.repository.module';
import { MemberController } from './controllers/member.controller';
import { MemberService } from './services/member.service';

@Module({
  imports: [MemberRepositoryModule, AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
