import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ResponseIdSerialization {
    @Expose()
    @ApiProperty({
        description: 'Id that representative with your target data',
        example: '631d9f32a65cf07250b8938c',
        required: true,
    })
    @Type(() => String)
    _id: string;
}
