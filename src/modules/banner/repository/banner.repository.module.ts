import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import {
    BannerEntity,
    BannerSchema,
} from 'src/modules/banner/repository/entities/banner.entity';
import { BannerRepository } from 'src/modules/banner/repository/repositories/banner.repository';

@Module({
    providers: [BannerRepository],
    exports: [BannerRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: BannerEntity.name,
                    schema: BannerSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class BannerRepositoryModule {}
