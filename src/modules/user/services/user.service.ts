import { Injectable } from '@nestjs/common';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/user/repository/entities/user.entity';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';
import { UserBaseService } from 'src/modules/user/services/user.base.service';
import { NotificationSaveFcmRequestDto } from 'src/modules/notification/dtos/request/notification.save-fcm.request.dto';

@Injectable()
export class UserService extends UserBaseService<UserEntity, UserDoc> {
    constructor(private readonly userRepository: UserRepository) {
        super(userRepository);
    }

    async saveFcmToken(
        userId: string,
        dto: NotificationSaveFcmRequestDto
    ): Promise<void> {
        const user = await this.userRepository.findOneById(userId);
        if (user != null) {
            user.fcmToken = dto.fcmToken;
            await this.userRepository.save(user);
        }
    }

    async getFcmTokensByIds(userIds: string[]): Promise<string[]> {
        const users = await this.userRepository.findAll({
            _id: { $in: userIds },
        });
        return users.map(u => u.fcmToken);
    }
}
