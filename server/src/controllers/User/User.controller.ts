import UserRepository from "../../repositories/User/User.repository";
import logger from "../../configs/loggerConfig";
import type { IUserModel } from "../../models/IModels";
import { encryptPassword, comparePasswords, generateToken } from "../../helpers/index";
import ProfileRepository from "../../repositories/Profiles/Profile.repository";

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
            // Create default profile named "self" for the new user
            try {
                const profileRepo = new ProfileRepository();
                await profileRepo.createProfile({
                    name: "self",
                    userId: (user as any)._id.toString(),
                });
            } catch (profileErr) {
                logger.error({ error: (profileErr as any).message }, "Error creating default profile");
            }

            return {...user, password: undefined} as IUserModel;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error creating user"
            );
            throw error;
        }
    }

    public async loginUser(
        usernameOrEmail: string,
        password: string
    ): Promise<{ user: IUserModel; token: string }> {
        try {
            logger.info({ usernameOrEmail }, "User login attempt");
            const user = await this._userRepository.findUserByUsernameOrEmailWithPassword(usernameOrEmail);
            
            if (!user) {
                logger.warn({ usernameOrEmail }, "User not found during login");
                throw new Error("Invalid credentials");
            }

            const isPasswordValid = await comparePasswords(password, user.password);

            if (!isPasswordValid) {
                logger.warn({ usernameOrEmail }, "Invalid password during login");
                throw new Error("Invalid credentials");
            }

            const token = generateToken({
                userId: (user as any)._id.toString(),
                username: user.username,
                email: user.email,
            });

            logger.info(
                { userId: (user as any)._id },
                "User logged in successfully"
            );

            const userWithoutPassword = user;
            delete userWithoutPassword.password;

            return {
                user: userWithoutPassword,
                token,
            };
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error during login"
            );
            throw error;
        }
    }
}

export default UserController;