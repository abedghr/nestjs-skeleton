import { Injectable } from '@nestjs/common';
import {
    UserCustomerDoc,
    UserCustomerEntity,
} from 'src/modules/user/repository/entities/user-customer.entity';
import { UserBaseService } from 'src/modules/user/services/user.base.service';
import { UserCustomerRepository } from 'src/modules/user/repository/repositories/user.customer.repository';

@Injectable()
export class UserCustomerService extends UserBaseService<
    UserCustomerEntity,
    UserCustomerDoc
> {
    constructor(private readonly userNormalRepository: UserCustomerRepository) {
        super(userNormalRepository);
    }

    async existsByMobileNumber(mobileNumber: string): Promise<boolean> {
        return this.userNormalRepository.exists({ mobileNumber });
    }
}
