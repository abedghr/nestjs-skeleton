import {
    DatabaseEntity,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

@DatabaseEntity()
export class UserAuthEntity extends UserEntity {}

export const UserAuthSchema = DatabaseSchema(UserAuthEntity);
export type UserAuthDoc = IDatabaseDocument<UserAuthEntity>;
