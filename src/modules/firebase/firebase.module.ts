import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/modules/firebase/services/firebase.auth.service';
import path from 'path';
import * as admin from 'firebase-admin';
import { ENUM_APP_ENVIRONMENT } from 'src/app/enums/app.enum';
import { ConfigService } from '@nestjs/config'; // Make sure to install @nestjs/config if not already installed

// Helper function to determine if environment is production
function isProduction(configService: ConfigService): boolean {
    const appEnv = configService.get('APP_ENV');
    return appEnv === ENUM_APP_ENVIRONMENT.PRODUCTION;
}

@Module({
    exports: [FirebaseService],
    providers: [
        {
            provide: 'FIREBASE',
            inject: [ConfigService], // Inject ConfigService
            useFactory: (configService: ConfigService) => {
                const isProd = isProduction(configService);
                const fileName = isProd
                    ? 'firebase-sdk-prod.json'
                    : 'firebase-sdk.json';

                if (!isProd) {
                    console.log(
                        'FirebaseModule: Using development Firebase SDK'
                    );
                } else {
                    return admin.initializeApp(
                        {
                            credential: admin.credential.cert(
                                path.join(__dirname, `../../../${fileName}`)
                            ),
                        },
                        'firebase'
                    );
                }
            },
        },
        FirebaseService,
    ],
    controllers: [],
})
export class FirebaseModule {}
