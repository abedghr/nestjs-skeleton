import { DatabaseEntityAbstract } from 'src/common/database/abstracts/database.entity.abstract';
import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from 'src/common/database/decorators/database.decorator';
import { IDatabaseDocument } from 'src/common/database/interfaces/database.interface';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';
import { AwsS3Schema } from 'src/modules/aws/repository/entities/aws.s3.entity';
import { CountryEntity } from 'src/modules/country/repository/entities/country.entity';

export const BannerTableName = 'banners';

@DatabaseEntity({ collection: BannerTableName })
export class BannerEntity extends DatabaseEntityAbstract {
    @DatabaseProp({
        required: true,
        type: String,
        trim: true,
        maxlength: 255,
    })
    title: string;

    @DatabaseProp({
        type: String,
        trim: true,
        default: null,
    })
    description?: string;

    @DatabaseProp({
        required: true,
        type: String,
        ref: CountryEntity.name,
        trim: true,
    })
    country: string;

    @DatabaseProp({
        required: true,
        schema: AwsS3Schema,
    })
    image: AwsS3Dto;
    @DatabaseProp({
        required: false,
        type: String,
        trim: true,
        maxlength: 500,
    })
    redirectUrl: string;

    @DatabaseProp({
        required: true,
        default: true,
        type: Boolean,
    })
    isActive: boolean;

    @DatabaseProp({
        type: Date,
        default: Date.now,
    })
    createdAt: Date;

    @DatabaseProp({
        type: Date,
        default: Date.now,
    })
    updatedAt: Date;
}
export const BannerSchema = DatabaseSchema(BannerEntity);
export type BannerDoc = IDatabaseDocument<BannerEntity>;
