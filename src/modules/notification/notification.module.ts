import { forwardRef, Global, Module } from '@nestjs/common';
import { AwsModule } from 'src/modules/aws/aws.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { NotificationRepositoryModule } from 'src/modules/notification/repository/notification.repository.module';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@Global()
@Module({
    imports: [
        NotificationRepositoryModule,
        AwsModule,
        forwardRef(() => FirebaseModule),
    ],
    exports: [NotificationService],
    providers: [NotificationService],
    controllers: [],
})
export class NotificationModule {}
