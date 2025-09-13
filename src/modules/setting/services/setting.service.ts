import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    IDatabaseCreateManyOptions,
    IDatabaseCreateOptions,
    IDatabaseDeleteManyOptions,
    IDatabaseFindAllOptions,
    IDatabaseGetTotalOptions,
    IDatabaseOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { ENUM_HELPER_DATE_FORMAT } from 'src/common/helper/enums/helper.enum';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperNumberService } from 'src/common/helper/services/helper.number.service';
import {
    ENUM_SETTING_DATA_TYPE,
    ENUM_SETTING_NAME,
} from 'src/modules/setting/enums/setting.enum';
import { SettingCreateRequestDto } from 'src/modules/setting/dtos/request/setting.create.request.dto';
import { SettingUpdateRequestDto } from 'src/modules/setting/dtos/request/setting.update.request.dto';
import { ISettingService } from 'src/modules/setting/interfaces/setting.service.interface';
import {
    SettingDoc,
    SettingEntity,
} from 'src/modules/setting/repository/entities/setting.entity';
import { SettingRepository } from 'src/modules/setting/repository/repositories/setting.repository';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ENUM_SETTING_STATUS_CODE_ERROR } from 'src/modules/setting/enums/setting.status-code.enum';

@Injectable()
export class SettingService implements ISettingService {
    private readonly timezone: string;
    private readonly timezoneOffset: string;

    constructor(
        private readonly settingRepository: SettingRepository,
        private readonly helperNumberService: HelperNumberService,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService
    ) {
        this.timezone = this.configService.get<string>('app.timezone');
        this.timezoneOffset = this.helperDateService.format(
            this.helperDateService.create(),
            { format: ENUM_HELPER_DATE_FORMAT.TIMEZONE }
        );
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<SettingDoc[]> {
        return this.settingRepository.findAll(find, options);
    }

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseOptions
    ): Promise<SettingDoc> {
        return this.settingRepository.findOne(find, options);
    }

    async findOneById(
        _id: string,
        options?: IDatabaseOptions
    ): Promise<SettingDoc> {
        return this.settingRepository.findOneById(_id, options);
    }

    async findOneByName(
        name: string,
        options?: IDatabaseOptions
    ): Promise<SettingDoc> {
        return this.settingRepository.findOne({ name }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.settingRepository.getTotal(find, options);
    }

    async create(
        { name, description, type, value, code }: SettingCreateRequestDto,
        options?: IDatabaseCreateOptions
    ): Promise<SettingDoc> {
        const create: SettingEntity = new SettingEntity();
        create.name = name;
        create.description = description;
        create.value = value;
        create.type = type;
        create.code = code ? code : 'system';

        return this.settingRepository.create<SettingEntity>(create, options);
    }

    async createMany(
        data: SettingCreateRequestDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
        const create: SettingEntity[] = data.map(item => {
            const settingEntity = new SettingEntity();
            settingEntity.name = item.name;
            settingEntity.description = item.description;
            settingEntity.value = item.value;
            settingEntity.type = item.type;
            settingEntity.code = item.code ? item.code : 'system';
            return settingEntity;
        });

        await this.settingRepository.createMany<SettingEntity>(create, options);

        return true;
    }

    async update(
        repository: SettingDoc,
        { description, value }: SettingUpdateRequestDto,
        options?: IDatabaseSaveOptions
    ): Promise<SettingDoc> {
        repository.description = description;
        repository.value = value;

        return this.settingRepository.save(repository, options);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseDeleteManyOptions
    ): Promise<boolean> {
        try {
            await this.settingRepository.deleteMany(find, options);

            return true;
        } catch (error: unknown) {
            throw error;
        }
    }

    getValue<T>(type: ENUM_SETTING_DATA_TYPE, value: string): T {
        if (
            type === ENUM_SETTING_DATA_TYPE.BOOLEAN &&
            (value === 'true' || value === 'false')
        ) {
            return (value === 'true') as T;
        } else if (
            type === ENUM_SETTING_DATA_TYPE.NUMBER &&
            this.helperNumberService.check(value)
        ) {
            return Number(value) as T;
        } else if (type === ENUM_SETTING_DATA_TYPE.POINT) {
            return this.helperStringService.splitPoint(value) as T;
        }

        return value as T;
    }

    checkValue(type: ENUM_SETTING_DATA_TYPE, value: string): boolean {
        if (
            type === ENUM_SETTING_DATA_TYPE.BOOLEAN &&
            (value === 'true' || value === 'false')
        ) {
            return true;
        } else if (
            type === ENUM_SETTING_DATA_TYPE.NUMBER &&
            this.helperNumberService.check(value)
        ) {
            return true;
        } else if (
            type === ENUM_SETTING_DATA_TYPE.STRING &&
            typeof value === 'string'
        ) {
            return true;
        } else if (type === ENUM_SETTING_DATA_TYPE.POINT) {
            return this.helperStringService.checkPoint(value);
        }

        return false;
    }

    async getTimezone(): Promise<string> {
        return this.timezone;
    }

    async getTimezoneOffset(): Promise<string> {
        return this.timezoneOffset;
    }

    async getCurrencyByCountryCode(
        countryCode: string,
        exception = true
    ): Promise<string> {
        const settingDetails = await this.settingRepository.findOne({
            code: countryCode,
            name: ENUM_SETTING_NAME.CURRENCY,
        });
        if (!settingDetails) {
            if (exception) {
                throw new NotFoundException({
                    statusCode: ENUM_SETTING_STATUS_CODE_ERROR.NOT_FOUND,
                    message: 'setting.error.notFound',
                });
            } else {
                return '';
            }
        }

        return settingDetails.value;
    }

    async getVatByCountryCode(countryCode: string): Promise<number> {
        const settingDetails = await this.settingRepository.findOne({
            code: countryCode,
            name: ENUM_SETTING_NAME.VAT,
        });
        if (!settingDetails) {
            throw new NotFoundException({
                statusCode: ENUM_SETTING_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'setting.error.notFound',
            });
        }

        const checkValue = this.checkValue(
            settingDetails.type,
            settingDetails.value
        );
        if (!checkValue) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'setting.error.invalidSettingValue',
            });
        }

        const value: number = this.getValue(
            settingDetails.type,
            settingDetails.value
        );

        return value;
    }

    async getPointPerByCountryCode(countryCode: string): Promise<number> {
        const settingDetails: SettingDoc = await this.settingRepository.findOne(
            {
                code: countryCode,
                name: ENUM_SETTING_NAME.POINT_PER,
            }
        );

        if (!settingDetails) {
            throw new NotFoundException({
                statusCode: ENUM_SETTING_STATUS_CODE_ERROR.NOT_FOUND,
                message: 'setting.error.notFound',
            });
        }

        const checkValue = this.checkValue(
            settingDetails.type,
            settingDetails.value
        );

        const value: number =
            checkValue &&
            settingDetails.value != '' &&
            settingDetails.value != null
                ? this.getValue(settingDetails.type, settingDetails.value)
                : 0;

        return value;
    }
}
