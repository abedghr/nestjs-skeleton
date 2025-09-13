import { HttpStatus, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { NotificationDoc } from 'src/modules/notification/repository/entities/notification.entity';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@Injectable()
export class NotificationParsePipe implements PipeTransform {
    constructor(private readonly notificationService: NotificationService) {}

    async transform(value: any): Promise<NotificationDoc> {
        const notification: NotificationDoc =
            await this.notificationService.findOneById(value);
        if (!notification) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'notification.error.notFound',
            });
        }

        return notification;
    }
}
