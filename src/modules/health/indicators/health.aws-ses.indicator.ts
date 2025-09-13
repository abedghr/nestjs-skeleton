import { Injectable } from '@nestjs/common';
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { AwsSESService } from 'src/modules/aws/services/aws.ses.service';

@Injectable()
export class HealthAwsSESIndicator extends HealthIndicator {
    constructor(private readonly awsSESService: AwsSESService) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            const list = await this.awsSESService.listTemplates();
            list.TemplatesMetadata.forEach(e => {
                console.log('++ Available Templates ++');
                console.log(e.Name);
            });
            return this.getStatus(key, true);
        } catch (err: any) {
            throw new HealthCheckError(
                `HealthAwsSESIndicator Failed - ${err?.message}`,
                this.getStatus(key, false)
            );
        }
    }
}
