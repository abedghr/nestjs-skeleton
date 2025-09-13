import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from 'src/modules/email/services/email.service';
import { BullModule } from '@nestjs/bullmq';
import { ENUM_WORKER_QUEUES } from 'src/worker/enums/worker.enum';

@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: ENUM_WORKER_QUEUES.EMAIL_QUEUE,
        }),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.zoho.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'kofeapp@kofeapp.com',
                    pass: 'KofeMailFarouqi@1997',
                },
            },
            defaults: {
                from: 'kofeapp@kofeapp.com',
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
