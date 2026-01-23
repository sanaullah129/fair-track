import bcrypt from "bcryptjs";

const encryptPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export default encryptPassword;