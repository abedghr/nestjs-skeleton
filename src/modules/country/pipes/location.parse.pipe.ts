import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
    PipeTransform,
} from '@nestjs/common';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';
import { CountryService } from 'src/modules/country/services/country.service';
import { ENUM_SETTING_NAME } from 'src/modules/setting/enums/setting.enum';
import { SettingDoc } from 'src/modules/setting/repository/entities/setting.entity';
import { SettingService } from 'src/modules/setting/services/setting.service';

@Injectable()
export class CountryParsePipe implements PipeTransform {
    constructor(private readonly countryService: CountryService) {}

    async transform(value: any): Promise<CountryDoc> {
        const country: CountryDoc =
            await this.countryService.findOneById(value);
        if (!country) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'country.error.notFound',
            });
        }

        return country;
    }
}

@Injectable()
export class CountryByCodePipe implements PipeTransform {
    constructor(private readonly countryService: CountryService) {}

    async transform(countryCode: string): Promise<CountryDoc> {
        const country = await this.countryService.findOneByAlpha2(countryCode);

        if (!country) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'country.error.notFound',
            });
        }

        if (!country.isActive) {
            throw new NotFoundException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'country.error.inactive',
            });
        }

        return country;
    }
}

@Injectable()
export class LongitudeAndLatitudeParsePipe implements PipeTransform {
    constructor(
        private readonly settingService: SettingService,
        private readonly countryService: CountryService
    ) {}

    async transform({ longitude, latitude, countryCode }: any): Promise<{
        longitude: number;
        latitude: number;
        country: CountryDoc;
    }> {
        const country = await this.countryService.findOneByAlpha2(countryCode);

        if (!country) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'country.error.notFound',
            });
        }

        if (!country.isActive) {
            throw new NotFoundException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'country.error.inactive',
            });
        }

        if (!longitude || !latitude || longitude == null || latitude == null) {
            const countrySettings: SettingDoc =
                await this.settingService.findOne({
                    code: countryCode,
                    name: ENUM_SETTING_NAME.DEFAULT_LOCATION,
                });

            if (!countrySettings || !countrySettings.value) {
                throw new NotFoundException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'country.error.notFound',
                });
            }
            const checkValue = this.settingService.checkValue(
                countrySettings.type,
                countrySettings.value
            );

            if (!checkValue) {
                throw new BadRequestException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'setting.error.invalidSettingValue',
                });
            }

            const value: number[] = this.settingService.getValue(
                countrySettings.type,
                countrySettings.value
            );

            const [longitude, latitude] = value;
            const parsedLongitude = Number(longitude);
            const parsedLatitude = Number(latitude);

            if (
                parsedLongitude == null ||
                parsedLatitude == null ||
                isNaN(parsedLongitude) ||
                isNaN(parsedLatitude)
            ) {
                throw new BadRequestException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'setting.error.invalidSettingCoordinate',
                });
            }

            return {
                longitude: parsedLongitude,
                latitude: parsedLatitude,
                country,
            };
        }
        return {
            longitude: Number(longitude),
            latitude: Number(latitude),
            country,
        };
    }
}
