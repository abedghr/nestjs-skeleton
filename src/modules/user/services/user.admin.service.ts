import { BadRequestException, Injectable } from '@nestjs/common';
import {
    IDatabaseDeleteManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { ENUM_POLICY_ROLE_TYPE } from 'src/modules/policy/enums/policy.enum';
import { UserUpdateRequestDto } from 'src/modules/user/dtos/request/user.update.request.dto';
import { ENUM_USER_STATUS } from 'src/modules/user/enums/user.enum';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/enums/user.status-code.enum';
import { IUserJoinsDoc } from 'src/modules/user/interfaces/user.interface';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';
import { UserBaseService } from 'src/modules/user/services/user.base.service';
@Injectable()
export class UserAdminService extends UserBaseService<UserEntity, UserDoc> {
    constructor(private readonly userRepository: UserRepository) {
        super(userRepository);
    }

    async changeUserStatus(
        { user, status }: { user: UserDoc; status: ENUM_USER_STATUS },
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity> {
        if (
            status === ENUM_USER_STATUS.ACTIVE &&
            user.status === ENUM_USER_STATUS.PENDING
        ) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PENDING_REGISTRATION,
                message: 'user.error.userPendingRegistration',
            });
        }
        user.status = status;
        return this.userRepository.save(user, options);
    }

    async update(
        repository: UserDoc,
        {
            email,
            firstName,
            lastName,
            gender,
            dateOfBirth,
        }: UserUpdateRequestDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity> {
        const userWithRole: UserDoc & IUserJoinsDoc =
            await this.userRepository.join(
                repository,
                this.userRepository._join
            );

        const emailExists: boolean = await this.userRepository.exists({
            _id: { $ne: repository._id },
            email,
        });

        if (emailExists) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.EMAIL_EXIST,
                message: 'user.error.emailExist',
            });
        }

        repository.email = email;
        if (userWithRole.role.type === ENUM_POLICY_ROLE_TYPE.CUSTOMER) {
            repository.firstName = firstName;
            repository.lastName = lastName;
            repository.gender = gender;
            repository.dateOfBirth = dateOfBirth;
        }
        return this.userRepository.save(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        try {
            await this.userRepository.deleteMany(find, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }
}
