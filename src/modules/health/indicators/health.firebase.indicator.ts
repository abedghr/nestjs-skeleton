import { Injectable } from '@nestjs/common';
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { FirebaseService } from 'src/modules/firebase/services/firebase.auth.service';

@Injectable()
export class HealthFirebaseIndicator extends HealthIndicator {
    constructor(private readonly firebaseService: FirebaseService) {
        super();
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.firebaseService.checkAuth();
            return this.getStatus('firebase', true);
        } catch (err: any) {
            throw new HealthCheckError(
                `HealthAwsS3Indicator Failed - ${err?.message}`,
                this.getStatus('firebase', false)
            );
        }
    }
}
