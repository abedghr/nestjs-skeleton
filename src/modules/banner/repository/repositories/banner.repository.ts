import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseRepositoryAbstract } from 'src/common/database/abstracts/database.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    BannerDoc,
    BannerEntity,
} from 'src/modules/banner/repository/entities/banner.entity';
import { CountryEntity } from 'src/modules/country/repository/entities/country.entity';

@Injectable()
export class BannerRepository extends DatabaseRepositoryAbstract<
    BannerEntity,
    BannerDoc
> {
    constructor(
        @DatabaseModel(BannerEntity.name)
        private readonly bannerModel: Model<BannerEntity>
    ) {
        super(bannerModel, [
            {
                path: 'country',
                localField: 'country',
                foreignField: '_id',
                model: CountryEntity.name,
                justOne: true,
            },
        ]);
    }
}
