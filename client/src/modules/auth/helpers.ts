import type { IAuthData } from "./IAuth";

type SignUpAction = {
    type: "SET_FIELD";
    field: keyof IAuthData;
    payload: string;
};

export const signUpReducer = (state: IAuthData, action: SignUpAction): IAuthData => {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.payload };
        default:
            return state;
    }
};