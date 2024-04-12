import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ENUM_ROLE_TYPE } from 'src/common/auth/constants/auth.role.enum.constant';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/mongo/database.mongo.object-id.entity.abstract';
import { USER_GENDER } from 'src/modules/user/constants/user.enum.constants';

export const userDatabaseName = 'users';
@DatabaseEntity({ collection: userDatabaseName })
export class UserEntity extends DatabaseMongoObjectIdEntityAbstract {
  
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    enum: ENUM_ROLE_TYPE,
    default: ENUM_ROLE_TYPE.USER
  })
  type: ENUM_ROLE_TYPE;

  @Prop({
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    type: String,
  })
  username: string;
  
  @Prop({
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    type: String,
    maxlength: 100,
  })
  firstName: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    type: String,
    maxlength: 100,
  })
  lastName: string;

  @Prop({
    required: false,
    sparse: true,
    trim: true,
    unique: true,
    type: String,
    maxlength: 15,
  })
  mobileNumber?: string;

  @Prop({
    required: false,
    trim: true,
    type: String,
    maxlength: 4,
  })
  countryCode?: string;
  
  @Prop({
    required: false,
    trim: true,
    type: String,
    ref: UserEntity.name
  })
  createdBy?: string;
  
  @Prop({
    required: false,
    trim: true,
    type: String,
    ref: UserEntity.name
  })
  updatedBy?: string;

  @Prop({
    required: false,
    trim: true,
    type: String,
    ref: UserEntity.name
  })
  deletedBy?: string;


  @Prop({
    required: true,
    type: String,
    minlength: 8,
    maxlength: 1000
  })
  password: string;

  @Prop({
    required: false,
    type: Date,
  })
  signUpDate?: Date;

  @Prop({
    required: true,
    type: String,
  })
  salt: string;

  @Prop({
    required: true,
    default: false,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({
    required: true,
    type: String,
    enum: USER_GENDER,
  })
  gender: USER_GENDER;

  @Prop({
    required: false,
    trim: true,
    type: String,
    maxlength: 300,
  })
  deleteReason?: string;

  @Prop({
    required: false,
    _id: false,
    type: {
      path: String,
      pathWithFilename: String,
      filename: String,
      completedUrl: String,
      baseUrl: String,
      mime: String,
    },
  })
  photo?: AwsS3Serialization;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDoc = UserEntity & Document;


/*
  ******************************** BEGIN INDEXES DOCS ******************************************
*/


UserSchema.index({ username: 1 }, { name: 'username-unique-ndx', unique: true });
UserSchema.index({ email: 1 }, { name: 'email-unique-ndx', unique: true });
UserSchema.index({ mobileNumber: 1 }, { name: 'mobileNumber-unique-ndx', unique: true, sparse: true });


UserSchema.index({ username: 1, isDeleted: 1 }, { name: 'username-isDeleted-ndx'});
UserSchema.index({ email: 1, isDeleted: 1 }, { name: 'email-isDeleted-ndx'});
UserSchema.index({ mobileNumber: 1, isDeleted: 1 }, { name: 'mobileNumber-isDeleted-ndx'});



/*
  ******************************** END INDEXES DOCS ******************************************
*/