import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

@DatabaseEntity()
export class UserCustomerEntity extends UserEntity {
    @DatabaseProp({
        required: true,
        type: Number,
        default: 0,
    })
    currentPoints: number;

    @DatabaseProp({
        required: true,
        type: Number,
        default: 0,
    })
    overallPoints: number;
}

export const UserCustomerSchema = DatabaseSchema(UserCustomerEntity);
export type UserCustomerDoc = IDatabaseDocument<UserCustomerEntity>;
