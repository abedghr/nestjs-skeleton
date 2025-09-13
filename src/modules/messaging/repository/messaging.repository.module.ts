import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ConversationEntity, ConversationSchema } from './entities/conversation.entity';
import { MessageEntity, MessageSchema } from './entities/message.entity';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

@Module({
    providers: [ConversationRepository, MessageRepository,],
    exports: [ConversationRepository, MessageRepository,],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ConversationEntity.name,
                    schema: ConversationSchema,
                },
                {
                    name: MessageEntity.name,
                    schema: MessageSchema,
                }
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class MessagingRepositoryModule {}
