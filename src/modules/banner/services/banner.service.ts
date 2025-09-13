import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseQueryContain } from 'src/common/database/decorators/database.decorator';
import {
    IDatabaseCreateManyOptions,
    IDatabaseDeleteManyOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';
import { AwsS3Service } from 'src/modules/aws/services/aws.s3.service';
import { BannerCreateRequestDto } from 'src/modules/banner/dtos/request/banner.create.request.dto';
import { IBannerService } from 'src/modules/banner/interfaces/banner.service.interface';
import {
    BannerDoc,
    BannerEntity,
} from 'src/modules/banner/repository/entities/banner.entity';
import { BannerRepository } from 'src/modules/banner/repository/repositories/banner.repository';
import { v6 as uuidV6 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BannerService implements IBannerService {
    private readonly uploadPath: string;

    constructor(
        private readonly bannerRepository: BannerRepository,
        private readonly awsS3Service: AwsS3Service,
        private readonly configService: ConfigService
    ) {
        this.uploadPath = this.configService.get<string>('banner.uploadPath');
    }
    async getPhotoUploadPath(banner: string): Promise<string> {
        return this.uploadPath.replace('{banner}', banner);
    }
    async create(
        {
            title,
            description,
            country,
            redirectUrl,
            isActive,
        }: BannerCreateRequestDto,
        file: Express.Multer.File
    ): Promise<BannerDoc> {
        const createBanner: BannerEntity = new BannerEntity();
        createBanner.title = title;
        createBanner.description = description;
        createBanner.redirectUrl = redirectUrl;
        createBanner.isActive = isActive;
        createBanner.country = country;
        try {
            if (file) {
                const filename = `${uuidV6()}-${new Date().getTime()}`;

                const path: string = await this.getPhotoUploadPath(
                    createBanner.title
                );
                const awsS3Dto: AwsS3Dto =
                    await this.awsS3Service.putItemInBucketWithAcl(file, {
                        customFilename: filename,
                        path,
                    });
                createBanner.image = awsS3Dto;
            }
        } catch (err) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'banner.error.imageNotUploaded',
                _error: err.message ?? 'Image not uploaded',
            });
        }

        return this.bannerRepository.create<BannerEntity>(createBanner);
    }
    async update(
        _id: string,
        data: BannerCreateRequestDto
    ): Promise<BannerDoc> {
        try {
            const banner = await this.bannerRepository.findOneById(_id);

            if (!banner) {
                throw new NotFoundException({
                    statusCode: 'BANNER_NOT_FOUND',
                    message: 'Banner not found',
                });
            }

            banner.title = data.title;
            banner.description = data.description;
            banner.image = data.imageUrl;
            banner.redirectUrl = data.redirectUrl;
            banner.isActive = data.isActive;

            return this.bannerRepository.update({ _id: banner._id }, banner);
        } catch (error: unknown) {
            throw error;
        }
    }
    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<BannerDoc[]> {
        return this.bannerRepository.findAll(find, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<BannerDoc> {
        return this.bannerRepository.findOne(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc> {
        return this.bannerRepository.findOne(
            DatabaseQueryContain('name', name),
            options
        );
    }

    async findOneByAlpha2(
        alpha2: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc> {
        const result = await this.bannerRepository.findOne(
            DatabaseQueryContain('alpha2Code', alpha2),
            options
        );

        if (!result) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'banner.error.notFound',
            });
        }
        return result;
    }

    async findOneActiveByPhoneCode(
        phoneCode: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc> {
        return this.bannerRepository.findOne(
            {
                phoneCode,
                isActive: true,
            },
            options
        );
    }

    async findOneById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc> {
        return this.bannerRepository.findOneById(_id, options);
    }

    async findOneActiveById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<BannerDoc> {
        return this.bannerRepository.findOne({ _id, isActive: true }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.bannerRepository.getTotal(find, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        try {
            await this.bannerRepository.deleteMany(find, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }

    async delete(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        try {
            await this.bannerRepository.delete(find, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }

    async createMany(
        data: BannerCreateRequestDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        try {
            const entities: BannerEntity[] = data.map(
                ({
                    title,
                    description,
                    imageUrl,
                    redirectUrl,
                    isActive,
                }): BannerEntity => {
                    const create: BannerEntity = new BannerEntity();
                    create.title = title;
                    create.description = description;
                    create.image = imageUrl;
                    create.redirectUrl = redirectUrl;
                    create.isActive = isActive;

                    return create;
                }
            ) as BannerEntity[];

            await this.bannerRepository.createMany(entities, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }
}
