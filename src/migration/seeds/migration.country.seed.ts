import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CountryService } from 'src/modules/country/services/country.service';
import { CountryCreateRequestDto } from 'src/modules/country/dtos/request/country.create.request.dto';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';

@Injectable()
export class MigrationCountrySeed {
    constructor(private readonly countryService: CountryService) {}

    @Command({
        command: 'seed:country',
        describe: 'seeds countries',
    })
    async seeds(): Promise<void> {
        try {
            const data: CountryCreateRequestDto[] = [
                {
                    name: 'Jordan',
                    alpha2Code: ENUM_AVAILABLE_COUNTRIES.JO,
                    alpha3Code: 'JOR',
                    domain: 'id',
                    fipsCode: 'ID',
                    numericCode: '400',
                    phoneCode: ['962'],
                    continent: 'Asia',
                    timeZone: 'Asia/Amman',
                    isActive: true,
                },
            ];

            await this.countryService.createMany(data);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:country',
        describe: 'remove countries',
    })
    async remove(): Promise<void> {
        try {
            await this.countryService.deleteMany({});
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
