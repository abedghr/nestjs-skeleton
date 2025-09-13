import {
    CountryDoc,
    CountryEntity,
} from 'src/modules/country/repository/entities/country.entity';
import {
    RoleDoc,
    RoleEntity,
} from 'src/modules/role/repository/entities/role.entity';
import { UserAuthDoc } from 'src/modules/user/repository/entities/user-auth.entity';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/user/repository/entities/user.entity';

export interface IUserEntity
    extends Omit<UserEntity, 'role' | 'country' | 'mobileNumber'> {
    role: RoleEntity;
    county: CountryEntity;
    mobileNumber?: { country: CountryEntity; number: string };
}

export interface IUserJoinsEntity {
    role: RoleEntity;
    country: CountryEntity;
}
export interface IUserJoinsDoc {
    role: RoleDoc;
    country: CountryDoc;
}

export interface IUserDoc extends Omit<UserDoc, 'role' | 'country'> {
    role: RoleDoc;
    country: CountryDoc;
}

export interface IUserAuthDoc extends Omit<UserAuthDoc, 'role' | 'country'> {
    role: RoleDoc;
    country: CountryDoc;
}
