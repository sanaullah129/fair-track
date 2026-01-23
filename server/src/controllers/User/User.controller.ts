import UserRepository from "../../repositories/User/User.repository";
import logger from "../../configs/loggerConfig";
import type { IUserModel } from "../../models/IModels";

class UserController {
    private _userRepository: UserRepository;
    constructor() {
        this._userRepository = new UserRepository();
    }

    public async getUser(
        username: string,
        email: string
    ): Promise<IUserModel | null> {
        try {
            logger.info({ username, email }, "Fetching user by username or email");
            const user = await this._userRepository.findUserByUsernameOrEmail(
                username,
                email
            );
            if (!user) {
                logger.warn({ username, email }, "User not found");
            }
            return user;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching user"
            );
            throw error;
        }
    }

    public async signUpUser(
        userData: Partial<IUserModel>
    ): Promise<IUserModel> {
        try {
            logger.info({ username: userData.username }, "Creating new user");
            const user = await this._userRepository.createUser(userData);
            logger.info(
                { userId: (user as any)._id },
                "User created successfully"
            );
            return user;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error creating user"
            );
            throw error;
        }
    }
}

export default UserController;