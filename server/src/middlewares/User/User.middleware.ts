import { Request, Response } from "express";
import { IUserModel, UserType } from "../../models/IModels";
import UserController from "../../controllers/User/User.controller";
import logger from "../../configs/loggerConfig";
import { validateSignUpData } from "./validations";

class UserMiddleware {
    private userController = new UserController();

    public async signUp(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Sign-up request received");
            const { username, email, password, type } =
                req.body as Partial<IUserModel>;

            if (!validateSignUpData(req.body)) {
                logger.warn({ username, email }, "Invalid sign-up data");
                res.status(400).json({ message: "Invalid sign-up data" });
                return;
            }

            const isUserExists = await this.userController.getUser(
                username!,
                email!
            );
            if (isUserExists) {
                logger.warn(
                    { username, email },
                    "User already exists"
                );
                res.status(409).json({ message: "User already exists" });
                return;
            }

            // Create new user
            const newUser = await this.userController.signUpUser({
                username,
                email,
                password,
                type: type || UserType.USER,
            });

            logger.info({ userId: (newUser as any)._id }, "User signed up successfully");
            res.status(201).json({
                message: "User signed up successfully",
                user: newUser,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in sign-up middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
}

export default UserMiddleware;