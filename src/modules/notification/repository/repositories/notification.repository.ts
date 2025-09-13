import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    NotificationDoc,
    NotificationEntity,
} from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends DatabaseRepositoryAbstract<
    NotificationEntity,
    NotificationDoc
> {
    constructor(
        @DatabaseModel(NotificationEntity.name)
        private readonly notificationModel: Model<NotificationEntity>
    ) {
        super(notificationModel);
    }
}
