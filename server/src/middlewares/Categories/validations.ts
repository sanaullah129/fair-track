import { ICategoryModel } from "../../models/IModels";

const validateCreateCategoryData = (data: Partial<ICategoryModel>): boolean => {
    if (!data.name || !data.userId) {
        return false;
    }

    if (typeof data.name !== "string" || data.name.trim().length < 2) {
        return false;
    }

    if (data.name.length > 100) {
        return false;
    }

    if (data.description && typeof data.description !== "string") {
        return false;
    }

    if (data.description && data.description.length > 500) {
        return false;
    }

    return true;
};

const validateUpdateCategoryData = (data: Partial<ICategoryModel>): boolean => {
    if (data.name) {
        if (typeof data.name !== "string" || data.name.trim().length < 2) {
            return false;
        }

        if (data.name.length > 100) {
            return false;
        }
    }

    if (data.description) {
        if (typeof data.description !== "string") {
            return false;
        }

        if (data.description.length > 500) {
            return false;
        }
    }

    return true;
};

export { validateCreateCategoryData, validateUpdateCategoryData };
