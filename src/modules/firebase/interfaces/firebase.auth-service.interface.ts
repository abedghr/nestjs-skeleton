import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export interface IFirebaseAuthService {
    verifyToken(token: string): Promise<DecodedIdToken>;
}
