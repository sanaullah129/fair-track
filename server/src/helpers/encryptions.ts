import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};