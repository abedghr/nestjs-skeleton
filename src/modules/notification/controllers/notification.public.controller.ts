import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { IResponsePaging } from 'src/common/response/interfaces/response.interface';
import { NotificationDoc } from 'src/modules/notification/repository/entities/notification.entity';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NotificationListDoc } from 'src/modules/notification/docs/notification.public.doc';
import { NotificationListResponseDto } from 'src/modules/notification/dtos/response/notification.list.response.dto';
import { LongitudeAndLatitudeParsePipe } from 'src/modules/country/pipes/location.parse.pipe';
import { HeaderUserLocation } from 'src/modules/country/decorators/header-country-by-code.decorator';
import { CountryDoc } from 'src/modules/country/repository/entities/country.entity';
import { ENUM_FIREBASE_TOPICS } from 'src/modules/firebase/constants/firebase.enum';
import { ENUM_AVAILABLE_COUNTRIES } from 'src/common/doc/enums/doc.enum';

@ApiTags('modules.public.notification')
@Controller({
    version: '1',
    path: '/notification',
})
export class NotificationPublicController {
    constructor(private readonly notificationService: NotificationService) {}

    @NotificationListDoc()
    @ResponsePaging('notification.list', {
        serialization: NotificationListResponseDto,
    })
    @Get('/list')
    async list(
        @HeaderUserLocation(LongitudeAndLatitudeParsePipe)
        location: {
            longitude: number;
            latitude: number;
            country: CountryDoc;
        }
    ): Promise<IResponsePaging<NotificationDoc>> {
        const find: Record<string, any> = {};
        if (location.country.alpha2Code === ENUM_AVAILABLE_COUNTRIES.JO) {
            find.topic = ENUM_FIREBASE_TOPICS.GENERAL_USERS_JO;
        }

        const notifications: NotificationDoc[] =
            await this.notificationService.findAll(find);

        return {
            data: notifications,
            _pagination: {
                total: notifications.length,
                totalPage: 1,
            },
        };
    }
}
