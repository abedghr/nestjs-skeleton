export interface ICreateUserLogicOptions<T = any> {
    createdByAdmin?: boolean;
    createdBy?: string;
}

export interface IUpdateUserLogicOptions<T = any> {
    updatedBy?: string;
}