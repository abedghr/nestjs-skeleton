export interface IAuthPassword {
    salt: string;
    passwordHash: string;
    passwordCreated: Date;
}

export interface IAuthPasswordOptions {
    temporary: boolean;
}
