import { IProfileModel } from "../../models/IModels";

const validateCreateProfileData = (data: Partial<IProfileModel>): boolean => {
    if (!data.name || !data.userId) {
        return false;
    }

    if (typeof data.name !== "string" || data.name.trim().length < 2) {
        return false;
    }

    if (data.name.length > 100) {
        return false;
    }

    return true;
};

const validateUpdateProfileData = (data: Partial<IProfileModel>): boolean => {
    if (data.name) {
        if (typeof data.name !== "string" || data.name.trim().length < 2) {
            return false;
        }

        if (data.name.length > 100) {
            return false;
        }
    }

    return true;
};

export { validateCreateProfileData, validateUpdateProfileData };
