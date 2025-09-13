import {
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { NotificationDoc } from 'src/modules/notification/repository/entities/notification.entity';

export interface INotificationService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<NotificationDoc[]>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<NotificationDoc>;

    findOneById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<NotificationDoc>;

    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
}
