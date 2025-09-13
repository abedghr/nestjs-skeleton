import { registerAs } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from 'src/app/enums/app.enum';

export default registerAs(
    'banner',
    (): Record<string, any> => ({
        uploadPath:
            process.env.APP_ENV === ENUM_APP_ENVIRONMENT.PRODUCTION
                ? 'banner/{banner}'
                : 'test/banner/{banner}',
    })
);
