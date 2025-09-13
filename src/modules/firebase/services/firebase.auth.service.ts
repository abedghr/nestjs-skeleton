import {
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { IFirebaseAuthService } from 'src/modules/firebase/interfaces/firebase.auth-service.interface';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/enums/user.status-code.enum';
import {
    ENUM_MAIN_APP_FIREBASE_COLLECTION,
    ENUM_FIREBASE_TOPICS,
    ENUM_FIREBASE_APPS,
} from 'src/modules/firebase/constants/firebase.enum';
import { Message } from 'firebase-admin/messaging';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements IFirebaseAuthService {
    constructor(@Inject('FIREBASE') private mainApp: admin.app.App) {}

    async checkAuth(): Promise<boolean> {
        try {
            await this.mainApp.auth().listUsers();
            return true;
        } catch (err: any) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.FORBIDDEN,
                message: err.message,
            });
        }
    }

    async verifyToken(token: string): Promise<DecodedIdToken> {
        try {
            return await this.mainApp.auth().verifyIdToken(token);
        } catch (err: any) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.FORBIDDEN,
                message: 'auth.error.invalidFirebaseToken',
                error: err,
            });
        }
    }

    async setToMainAppFireStore(
        database: ENUM_MAIN_APP_FIREBASE_COLLECTION,
        docUniqueField: string,
        data: Record<string, any>
    ) {
        try {
            return await this.mainApp
                .firestore()
                .collection(database)
                .doc(docUniqueField)
                .set(data);
        } catch (err: any) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.FORBIDDEN,
                message: 'auth.error.firebaseMainAppFireStoreError',
                error: err,
            });
        }
    }

    async composeNotification(message: {
        title: string;
        body: string;
        targetTopic: ENUM_FIREBASE_TOPICS;
        data?: Record<string, string>;
    }) {
        try {
            // Configure FCM message
            const notificationMessage: Message = {
                topic: message.targetTopic,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: {
                    ...message.data,
                },
                android: {
                    priority: 'high' as const,
                    notification: {
                        sound: 'default',
                        priority: 'max' as const,
                        channelId: 'default',
                    },
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                    },
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                            'content-available': 1,
                            'mutable-content': 1,
                        },
                    },
                },
            };
            const response = await this.mainApp
                .messaging()
                .send(notificationMessage);

            return response;
        } catch (err: any) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.FORBIDDEN,
                message: 'notification.error.composeFailed',
                error: err,
            });
        }
    }

    async sendByTokens(
        tokens: string[],
        content: {
            title: string;
            body: string;
            data: Record<string, any>;
        },
        fireBaseApp: ENUM_FIREBASE_APPS
    ) {
        // Configure FCM message
        const notificationMessage = {
            notification: {
                title: content.title,
                body: content.body,
            },
            data: {
                ...content.data,
            },
            android: {
                priority: 'high' as const,
                notification: {
                    sound: 'default',
                    priority: 'max' as const,
                    channelId: 'default',
                },
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                        'content-available': 1,
                        'mutable-content': 1,
                    },
                },
            },
        };

        let app: admin.app.App | null = null;
        if (fireBaseApp === ENUM_FIREBASE_APPS.MAIN_APP) {
            app = this.mainApp;
        }

        if (app == null) {
            throw new InternalServerErrorException({
                statusCode: 500,
                message: 'firebase.error.appNotFound',
            });
        }
        try {
            await app.messaging().sendEachForMulticast({
                tokens,
                ...notificationMessage,
            });
        } catch (err: any) {
            console.log('firebase.error.sendByTokensFailed', err);
            // throw new InternalServerErrorException({
            //     statusCode: 500,
            //     message: 'firebase.error.sendByTokensFailed',
            //     error: err,
            // });
        }
    }
}
