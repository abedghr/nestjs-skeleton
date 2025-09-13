import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from 'src/modules/email/processors/email.processor';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
    imports: [BullModule, EmailModule],
    providers: [EmailProcessor],
})
export class WorkerModule {}
