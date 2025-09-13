import {
    IDatabaseDeleteManyOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { Injectable } from '@nestjs/common';
import { NotificationCreateRequestDto } from '../dtos/request/notification.create.request.dto';
import { NotificationRepository } from '../repository/repositories/notification.repository';
import {
    NotificationDoc,
    NotificationEntity,
} from '../repository/entities/notification.entity';
import { INotificationService } from '../interfaces/notification.service.interface';
import { FirebaseService } from 'src/modules/firebase/services/firebase.auth.service';
import { ENUM_FIREBASE_APPS } from 'src/modules/firebase/constants/firebase.enum';

@Injectable()
export class NotificationService implements INotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly firebaseService: FirebaseService
    ) {}

    async create(dto: NotificationCreateRequestDto): Promise<NotificationDoc> {
        const { title, body, data, topic, redirectUrl } = dto;

        const entity = new NotificationEntity();
        entity.title = title;
        entity.body = body;
        entity.redirectUrl = redirectUrl;
        entity.data = data;
        entity.topic = topic;

        this.firebaseService.composeNotification({
            title: entity.title,
            body: entity.body,
            targetTopic: entity.topic,
            data: { ...data, redirectUrl },
        });
        const createdNotification =
            await this.notificationRepository.create<NotificationEntity>(
                entity
            );

        return createdNotification;
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<NotificationDoc[]> {
        return this.notificationRepository.findAll(find, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<NotificationDoc> {
        return this.notificationRepository.findOne(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<NotificationDoc> {
        return this.notificationRepository.findOneById(_id, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.notificationRepository.getTotal(find, options);
    }

    async delete(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        await this.notificationRepository.delete(find, options);
        return true;
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        await this.notificationRepository.deleteMany(find, options);
        return true;
    }

    async notifyUsersByFcmTokens({
        fcmTokens,
        content,
        firebaseApp,
    }: {
        fcmTokens: string[];
        content: {
            title: string;
            body: string;
            redirectUrl: string;
        };
        firebaseApp: ENUM_FIREBASE_APPS;
    }) {
        await this.firebaseService.sendByTokens(
            fcmTokens,
            {
                title: content.title,
                body: content.body,
                data: {
                    redirectUrl: content.redirectUrl,
                },
            },
            firebaseApp
        );
    }
}
