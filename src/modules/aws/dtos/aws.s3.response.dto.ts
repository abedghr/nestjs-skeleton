import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AwsS3ResponseDto {
    @Expose()
    @ApiProperty()
    @Type(() => String)
    completedUrl: string;
}
