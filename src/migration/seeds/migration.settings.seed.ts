import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SettingService } from 'src/modules/setting/services/setting.service';
import { SettingCreateRequestDto } from 'src/modules/setting/dtos/request/setting.create.request.dto';
import {
    ENUM_SETTING_DATA_TYPE,
    ENUM_SETTING_NAME,
} from 'src/modules/setting/enums/setting.enum';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';

@Injectable()
export class MigrationSettingSeed {
    constructor(private readonly settingService: SettingService) {}

    @Command({
        command: 'seed:setting',
        describe: 'seeds settings',
    })
    async seeds(): Promise<void> {
        try {
            const data: SettingCreateRequestDto[] = [
                {
                    name: ENUM_SETTING_NAME.CURRENCY,
                    value: 'JOD',
                    description: 'Currency',
                    type: ENUM_SETTING_DATA_TYPE.STRING,
                    code: ENUM_AVAILABLE_COUNTRIES.JO,
                },
                {
                    name: ENUM_SETTING_NAME.DEFAULT_LOCATION,
                    value: '31.9577809,35.8545998',
                    description: 'Default location for customers',
                    type: ENUM_SETTING_DATA_TYPE.POINT,
                    code: ENUM_AVAILABLE_COUNTRIES.JO,
                },
                {
                    name: ENUM_SETTING_NAME.POINT_PER,
                    value: '0.1',
                    description: 'Point pair',
                    type: ENUM_SETTING_DATA_TYPE.STRING,
                    code: ENUM_AVAILABLE_COUNTRIES.JO,
                },
                {
                    name: ENUM_SETTING_NAME.VAT,
                    value: '0.15',
                    description: 'Value Added Tax',
                    type: ENUM_SETTING_DATA_TYPE.NUMBER,
                    code: ENUM_AVAILABLE_COUNTRIES.JO,
                },
            ];

            await this.settingService.createMany(data);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:setting',
        describe: 'remove settings',
    })
    async remove(): Promise<void> {
        try {
            await this.settingService.deleteMany({});
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
