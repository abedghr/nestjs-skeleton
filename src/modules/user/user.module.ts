import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication-service.service';
import { UserRepositoryModule } from './repositories/user.repository.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { AdminController } from './controllers/admin.controller';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  imports: [UserRepositoryModule, AuthModule, AwsModule],
  controllers: [UserController, AuthenticationController, AdminController],
  providers: [UserService, AuthenticationService],
  exports: [UserService],
})
export class UserModule {}
