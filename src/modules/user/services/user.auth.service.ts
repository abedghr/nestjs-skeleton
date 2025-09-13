import { UserAuthRepository } from '../repository/repositories/user-auth.repository';
import { Injectable } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import {
    ENUM_USER_SIGN_UP_FROM,
    ENUM_USER_STATUS,
} from 'src/modules/user/enums/user.enum';
import { IAuthPassword } from 'src/modules/auth/interfaces/auth.interface';
import { UserCreateRequestDto } from 'src/modules/user/dtos/request/user.create.request.dto';
import { UserBaseService } from 'src/modules/user/services/user.base.service';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';

@Injectable()
export class UserAuthService extends UserBaseService<UserEntity, UserDoc> {
    constructor(
        private readonly userAuthRepository: UserAuthRepository,
        private readonly helperDateService: HelperDateService
    ) {
        super(userAuthRepository);
    }

    async create(
        {
            email,
            username,
            mobileNumber,
            firstName,
            role,
            roleType,
            country,
        }: UserCreateRequestDto,
        { passwordHash, salt, passwordCreated }: IAuthPassword,
        signUpFrom: ENUM_USER_SIGN_UP_FROM,
        options?: IDatabaseCreateOptions
    ): Promise<UserDoc> {
        const create: UserEntity = new UserEntity();
        create.username = username;
        create.mobileNumber = mobileNumber;
        create.email = email;
        create.firstName = firstName;
        create.role = role;
        create.roleType = roleType;
        create.status = ENUM_USER_STATUS.ACTIVE;
        create.password = passwordHash;
        create.salt = salt;
        create.passwordCreated = passwordCreated;
        create.signUpDate = this.helperDateService.create();
        create.signUpFrom = signUpFrom;
        create.country = country;

        return this.userAuthRepository.create<UserEntity>(create, options);
    }

    async updatePassword(
        repository: UserDoc,
        { passwordHash, passwordCreated, salt }: IAuthPassword,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.password = passwordHash;
        repository.passwordCreated = passwordCreated;
        repository.salt = salt;
        return this.userAuthRepository.save(repository, options);
    }
}
