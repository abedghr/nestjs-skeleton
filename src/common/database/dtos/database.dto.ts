import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class DatabaseDto {
    @ApiProperty({
        description: 'Alias id of api key',
        example: faker.string.uuid(),
        required: true,
    })
    @Expose()
    _id: string;

    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    @Expose()
    @Transform(({ value }) =>
        value instanceof Date ? value.toISOString() : value
    )
    // @Transform(({ value }) => value.toISOString())
    createdAt: Date;
    

    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    @Expose()
    @Transform(({ value }) =>
        value instanceof Date ? value.toISOString() : value
    )
    updatedAt: Date;

    @ApiProperty({
        description: 'Flag for deleted',
        default: false,
        required: true,
        nullable: false,
    })
    @Expose()
    deleted: boolean;

    @ApiProperty({
        description: 'Date delete at',
        required: false,
        nullable: true,
    })
    @Expose()
    @Transform(({ value }) =>
        value instanceof Date ? value.toISOString() : value
    )
    deletedAt?: Date;

    @ApiProperty({
        description: 'Delete by',
        required: false,
        nullable: true,
    })
    @Expose()
    deletedBy?: string;
}
