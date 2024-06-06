import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MemberModule } from 'src/modules/member/member.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    MemberModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
