import {
    DatabaseEntity,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { UserAuthEntity } from 'src/modules/user/repository/entities/user-auth.entity';

@DatabaseEntity()
export class UserProviderEntity extends UserAuthEntity {}

export const UserProviderSchema = DatabaseSchema(UserProviderEntity);
export type UserProviderDoc = IDatabaseDocument<UserProviderEntity>;
