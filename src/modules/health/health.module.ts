import { RedisModule } from 'src/common/redis/redis.module';
import { Module } from '@nestjs/common';
import { AwsModule } from 'src/modules/aws/aws.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { HealthAwsS3Indicator } from 'src/modules/health/indicators/health.aws-s3.indicator';
import { HealthAwsSESIndicator } from 'src/modules/health/indicators/health.aws-ses.indicator';
import { HealthFirebaseIndicator } from 'src/modules/health/indicators/health.firebase.indicator';
import { HealthRedisIndicator } from 'src/modules/health/indicators/health.redis.indicator';

@Module({
    providers: [
        HealthAwsS3Indicator,
        HealthFirebaseIndicator,
        HealthAwsSESIndicator,
        HealthRedisIndicator,
    ],
    exports: [
        HealthAwsS3Indicator,
        HealthFirebaseIndicator,
        HealthAwsSESIndicator,
        HealthRedisIndicator,
    ],
    imports: [AwsModule, FirebaseModule, RedisModule],
})
export class HealthModule {}
