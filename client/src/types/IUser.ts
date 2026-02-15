export interface IUserModel {
    username: string;
    email: string;
    password: string;
    type: UserType;
}

export type UserType = "admin" | "user";
