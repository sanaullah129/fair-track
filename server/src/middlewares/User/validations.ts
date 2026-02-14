import { IUserModel } from "../../models/IModels";

const validateSignUpData = (data: Partial<IUserModel>): boolean => {
    if (!data.username || !data.email || !data.password) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    if (data.password.length < 6) {
        return false;
    }

    if (data.username.length < 3) {
        return false;
    }

    return true;
};

const validateLoginData = (data: any): boolean => {
    if (!data.usernameOrEmail || !data.password) {
        return false;
    }

    if (typeof data.usernameOrEmail !== "string" || data.usernameOrEmail.trim().length === 0) {
        return false;
    }

    if (typeof data.password !== "string" || data.password.length < 6) {
        return false;
    }

    return true;
};

export { validateSignUpData, validateLoginData };