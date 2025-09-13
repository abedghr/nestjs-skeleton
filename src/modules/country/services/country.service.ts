import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseQueryContain } from 'src/common/database/decorators/database.decorator';
import {
    IDatabaseCreateManyOptions,
    IDatabaseDeleteManyOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
} from 'src/common/database/interfaces/database.interface';
import { CountryCreateRequestDto } from 'src/modules/country/dtos/request/country.create.request.dto';
import { ICountryService } from 'src/modules/country/interfaces/country.service.interface';
import {
    CountryDoc,
    CountryEntity,
} from 'src/modules/country/repository/entities/country.entity';
import { CountryRepository } from 'src/modules/country/repository/repositories/country.repository';

@Injectable()
export class CountryService implements ICountryService {
    constructor(private readonly countryRepository: CountryRepository) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<CountryDoc[]> {
        return this.countryRepository.findAll(find, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<CountryDoc> {
        return this.countryRepository.findOne(find, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseOptions
    ): Promise<CountryDoc> {
        return this.countryRepository.findOne(
            DatabaseQueryContain('name', name),
            options
        );
    }

    async findOneByAlpha2(
        alpha2: string,
        options?: IDatabaseOptions
    ): Promise<CountryDoc> {
        const result = await this.countryRepository.findOne(
            { alpha2Code: alpha2 },
            options
        );

        if (!result) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'country.error.notFound',
            });
        }
        return result;
    }

    async findOneActiveByPhoneCode(
        phoneCode: string,
        options?: IDatabaseOptions
    ): Promise<CountryDoc> {
        return this.countryRepository.findOne(
            { phoneCode, isActive: true },
            options
        );
    }

    async findOneById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<CountryDoc> {
        return this.countryRepository.findOneById(_id, options);
    }

    async findOneActiveById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<CountryDoc> {
        return this.countryRepository.findOne({ _id, isActive: true }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.countryRepository.getTotal(find, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        try {
            await this.countryRepository.deleteMany(find, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }

    async createMany(
        data: CountryCreateRequestDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        try {
            const entities: CountryEntity[] = data.map(
                ({
                    name,
                    alpha2Code,
                    alpha3Code,
                    numericCode,
                    continent,
                    fipsCode,
                    phoneCode,
                    timeZone,
                    domain,
                    isActive,
                }): CountryCreateRequestDto => {
                    const create: CountryEntity = new CountryEntity();
                    create.name = name;
                    create.alpha2Code = alpha2Code;
                    create.alpha3Code = alpha3Code;
                    create.numericCode = numericCode;
                    create.continent = continent;
                    create.fipsCode = fipsCode;
                    create.phoneCode = phoneCode;
                    create.timeZone = timeZone;
                    create.domain = domain;
                    create.isActive = isActive;

                    return create;
                }
            ) as CountryEntity[];

            await this.countryRepository.createMany(entities, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }
}
