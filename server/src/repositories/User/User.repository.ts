import bcrypt from "bcrypt";
import { IUserModel } from "../../models/IModels";
import UserModel from "../../models/User.model";
import envConfig from "../../configs/envConfig";

class UserRepository {
    constructor() {}

    public async findUserByUsernameOrEmail(
        username: string,
        email: string
    ): Promise<IUserModel | null> {
        const user = await UserModel.findOne({
            $or: [{ username }, { email }],
        });
        return user;
    }

    public async createUser(
        userData: Partial<IUserModel>
    ): Promise<IUserModel> {
        const hashedPassword = await bcrypt.hash(
            userData.password!,
            envConfig.bcryptRounds
        );
        const newUser = new UserModel({
            ...userData,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        return savedUser.toObject();
    }
}

export default UserRepository;