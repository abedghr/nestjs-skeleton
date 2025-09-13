import { HttpStatus, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { BannerDoc } from 'src/modules/banner/repository/entities/banner.entity';
import { BannerService } from 'src/modules/banner/services/banner.service';

@Injectable()
export class BannerParsePipe implements PipeTransform {
    constructor(private readonly bannerService: BannerService) {}

    async transform(value: any): Promise<BannerDoc> {
        const banner: BannerDoc = await this.bannerService.findOneById(value);
        if (!banner) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'banner.error.notFound',
            });
        }

        return banner;
    }
}
