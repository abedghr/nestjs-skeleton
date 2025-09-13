import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { DatabaseDto } from 'src/common/database/dtos/database.dto';
import { AwsS3ResponseDto } from 'src/modules/aws/dtos/aws.s3.response.dto';

export class BannerListResponseDto extends DatabaseDto {
    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    description?: string;

    @Expose()
    @ApiProperty()
    @Transform(({ value }) => value.completedUrl)
    image: AwsS3ResponseDto;

    @Expose()
    @ApiProperty()
    redirectUrl: string;
}
