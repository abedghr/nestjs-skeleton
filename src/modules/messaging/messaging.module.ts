import { Module } from '@nestjs/common';
import { MessagingRepositoryModule } from './repository/messaging.repository.module';
import { MessagingService } from './services/messaging.service';
import { ConversationService } from './services/conversation.service';
import { UserStatusService } from './services/user-status.service';
import { MessagingGateway } from './gateways/messaging.gateway';
import { MessagingController } from './controllers/messaging.controller';
import { UserModule } from '../user/user.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { AwsModule } from '../aws/aws.module';

@Module({
    imports: [
        MessagingRepositoryModule,
        UserModule,
        PaginationModule,
        AuthModule,
        NotificationModule,
        AwsModule,
    ],
    exports: [
        MessagingService,
        ConversationService,
        UserStatusService,
        MessagingGateway,
    ],
    providers: [
        MessagingService,
        ConversationService,
        UserStatusService,
        MessagingGateway,
    ],
    controllers: [MessagingController],
})
export class MessagingModule {}

