export interface IAuthPassword {
    salt: string;
    passwordHash: string;
}

export interface IAuthPayloadOptions {
    loginDate: Date;
}

export interface IAuthRefreshTokenOptions {
    // in milis
    notBeforeExpirationTime?: number | string;
}
