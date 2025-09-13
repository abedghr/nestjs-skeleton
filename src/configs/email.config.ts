import { registerAs } from '@nestjs/config';

export default registerAs(
    'email',
    (): Record<string, any> => ({
        fromEmail: 'kofeapp@kofeapp.com',
        supportEmail: 'kofeapp@kofeapp.com',

        clientUrl:
            process.env.CLIENT_URL ??
            'https://main.d37kare1fnpuuv.amplifyapp.com',
    })
);
