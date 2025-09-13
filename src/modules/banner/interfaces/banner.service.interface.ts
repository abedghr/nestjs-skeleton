import {
    IDatabaseCreateManyOptions,
    IDatabaseDeleteManyOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { BannerCreateRequestDto } from 'src/modules/banner/dtos/request/banner.create.request.dto';
import { BannerDoc } from 'src/modules/banner/repository/entities/banner.entity';

export interface IBannerService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<BannerDoc[]>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<BannerDoc>;
    findOneByName(name: string, options?: IDatabaseOptions): Promise<BannerDoc>;
    findOneByAlpha2(
        alpha2: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc>;
    findOneActiveByPhoneCode(
        phoneCode: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc>;
    findOneById(_id: string, options?: IDatabaseOptions): Promise<BannerDoc>;
    findOneActiveById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean>;
    createMany(
        data: BannerCreateRequestDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
