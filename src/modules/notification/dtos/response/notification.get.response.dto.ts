// notification.get.response.dto.ts
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseDto } from 'src/common/database/dtos/database.dto';
import { ENUM_FIREBASE_TOPICS } from 'src/modules/firebase/constants/firebase.enum';

export class NotificationGetResponseDto extends DatabaseDto {
    @Expose()
    @ApiProperty()
    _id: string;

    @Expose()
    @ApiProperty({
        required: true,
        type: String,
        description: 'Notification title',
        example: faker.commerce.productName(),
        maxLength: 255,
        minLength: 1,
    })
    title: string;

    @Expose()
    @ApiProperty({
        required: true,
        type: String,
        description: 'Notification body',
        example: faker.lorem.sentence(),
        maxLength: 255,
        minLength: 1,
    })
    body: string;

    @Expose()
    @ApiProperty({
        required: true,
        type: String,
        description: 'Notification topic',
        example: ENUM_FIREBASE_TOPICS.GENERAL_USERS_JO,
    })
    topic: ENUM_FIREBASE_TOPICS;

    @Expose()
    @ApiProperty()
    redirectUrl: string;

    @Expose()
    @ApiProperty({
        required: true,
        type: Object,
        description: 'Notification data',
        example: {},
    })
    data: Record<string, any>;

    // @Expose()
    // @ApiProperty({
    //     description: 'Date when the notification was created',
    //     example: faker.date.recent(),
    //     required: true,
    // })
    // @Transform(({ value }) =>
    //     value instanceof Date ? value.toISOString() : value
    // )
    // createdAt: Date;

    // @Expose()
    // @ApiProperty({
    //     description: 'Date when the notification was last updated',
    //     example: faker.date.recent(),
    //     required: true,
    // })
    // @Transform(({ value }) =>
    //     value instanceof Date ? value.toISOString() : value
    // )
    // updatedAt: Date;
}
