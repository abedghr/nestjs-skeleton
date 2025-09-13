import { Module } from '@nestjs/common';
import { AwsModule } from 'src/modules/aws/aws.module';
import { BannerRepositoryModule } from 'src/modules/banner/repository/banner.repository.module';
import { BannerService } from 'src/modules/banner/services/banner.service';

@Module({
    imports: [BannerRepositoryModule, AwsModule],
    exports: [BannerService],
    providers: [BannerService],
    controllers: [],
})
export class BannerModule {}
