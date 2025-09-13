import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { CountryEntity } from 'src/modules/country/repository/entities/country.entity';
import { RoleEntity } from 'src/modules/role/repository/entities/role.entity';
import {
    ENUM_USER_GENDER,
    ENUM_USER_SIGN_UP_FROM,
    ENUM_USER_STATUS,
} from 'src/modules/user/enums/user.enum';

export const UserTableName = 'users';

@DatabaseEntity({ collection: UserTableName })
export class UserEntity extends DatabaseEntityAbstract {
    @DatabaseProp({
        unique: true,
        index: true,
        required: true,
        trim: true,
        type: String,
        maxlength: 50,
        minlength: 3,
    })
    username: string;

    @DatabaseProp({
        unique: true,
        index: true,
        required: true,
        trim: true,
        type: String,
        maxlength: 20,
        minlength: 8,
    })
    mobileNumber: string;

    @DatabaseProp({
        required: true,
        trim: true,
        type: String,
        maxlength: 100,
        minlength: 3,
    })
    firstName: string;

    @DatabaseProp({
        required: false,
        trim: true,
        type: String,
        maxlength: 100,
        minlength: 3,
    })
    lastName?: string;

    @DatabaseProp({
        required: false,
        unique: true,
        trim: true,
        type: String,
        maxlength: 100,
        sparse: true,
    })
    email?: string;

    @DatabaseProp({
        required: true,
        ref: RoleEntity.name,
        trim: true,
    })
    role: string;

    @DatabaseProp({
        required: true,
        type: String,
        trim: true,
    })
    roleType: string;

    @DatabaseProp({
        required: true,
        ref: CountryEntity.name,
        trim: true,
    })
    country: string;

    @DatabaseProp({
        required: true,
        type: Date,
        trim: true,
    })
    signUpDate: Date;

    @DatabaseProp({
        required: true,
        enum: ENUM_USER_SIGN_UP_FROM,
    })
    signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @DatabaseProp({
        required: false,
        type: Date,
    })
    lastLoginDate?: Date;

    @DatabaseProp({
        required: false,
        type: Number,
    })
    loginFrom?: number;

    @DatabaseProp({
        required: false,
        type: Date,
    })
    lastActiveDate?: Date;

    @DatabaseProp({
        required: true,
        default: ENUM_USER_STATUS.ACTIVE,
        type: String,
        enum: ENUM_USER_STATUS,
    })
    status: ENUM_USER_STATUS;

    @DatabaseProp({
        required: true,
        type: String,
        trim: true,
    })
    password: string;

    @DatabaseProp({
        required: true,
        type: Date,
    })
    passwordCreated: Date;

    @DatabaseProp({
        required: true,
        type: String,
    })
    salt: string;

    @DatabaseProp({
        required: false,
        type: Date,
    })
    dateOfBirth?: Date;

    @DatabaseProp({
        required: false,
        enum: ENUM_USER_GENDER,
    })
    gender?: ENUM_USER_GENDER;

    @DatabaseProp({
        required: false,
        type: String,
        trim: true,
    })
    fcmToken: string;
}

export const UserSchema = DatabaseSchema(UserEntity);
// Use getFilter() to remove `__t` field from conditions
UserSchema.pre(
    [
        'find',
        'findOne',
        'findOneAndUpdate',
        'findOneAndDelete',
        'countDocuments',
    ],
    function (next) {
        const filter = this.getFilter();
        if (filter.__t) {
            delete filter.__t;
        }
        next();
    }
);

export type UserDoc = IDatabaseDocument<UserEntity>;
