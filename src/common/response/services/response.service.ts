import { Injectable } from '@nestjs/common';
import { RESPONSE_LOCALIZATION_FIELD_META_KEY } from 'src/common/response/constants/response.constant';

@Injectable()
export class ResponseService {
    constructor() {}

    transformLocalizedFields(data: any, language: string): any {
        if (!data) return data;

        // Handle arrays
        if (Array.isArray(data)) {
            return data.map(item =>
                this.transformLocalizedFields(item, language)
            );
        }

        // Handle objects
        if (typeof data === 'object') {
            const localizedFields =
                Reflect.getMetadata(
                    RESPONSE_LOCALIZATION_FIELD_META_KEY,
                    data.constructor
                ) || [];

            const transformed = { ...data };

            for (const key of Object.keys(transformed)) {
                if (localizedFields.includes(key)) {
                    // Handle localized field
                    if (
                        transformed[key] &&
                        typeof transformed[key] === 'object'
                    ) {
                        transformed[key] =
                            transformed[key][language] ||
                            transformed[key]['en'];
                    }
                } else if (typeof transformed[key] === 'object') {
                    // Recursive transformation for nested objects
                    transformed[key] = this.transformLocalizedFields(
                        transformed[key],
                        language
                    );
                }
            }

            return transformed;
        }

        return data;
    }
}
