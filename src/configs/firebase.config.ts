import { registerAs } from '@nestjs/config';

export default registerAs(
    'firebase',
    (): Record<string, any> => ({
        auth: {
            credential: {
                key: process.env.AWS_SES_CREDENTIAL_KEY,
                secret: process.env.AWS_SES_CREDENTIAL_SECRET,
            },
            region: process.env.AWS_SES_REGION,
        },
    })
);
