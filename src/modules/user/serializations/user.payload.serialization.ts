import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { UserProfileSerialization } from './user.profile.serialization';

export class UserPayloadSerialization extends OmitType(
    UserProfileSerialization,
    ['photo', 'signUpDate', 'createdAt', 'updatedAt'] as const
) {
    @Exclude()
    readonly photo?: AwsS3Serialization;

    @Exclude()
    readonly signUpDate: Date;

    @Expose()
    readonly loginDate: Date;

    @Exclude()
    readonly createdAt: number;

    @Exclude()
    readonly updatedAt: number;
}
