import { Request, Response } from "express";
import { IUserModel, UserType } from "../../models/IModels";
import UserController from "../../controllers/User/User.controller";
import logger from "../../configs/loggerConfig";
import { validateSignUpData, validateLoginData } from "./validations";

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

    public async login(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Login request received");
            const { usernameOrEmail, password } = req.body;

            if (!validateLoginData(req.body)) {
                logger.warn({ usernameOrEmail }, "Invalid login data");
                res.status(400).json({ message: "Invalid login data" });
                return;
            }

            const result = await this.userController.loginUser(usernameOrEmail, password);

            logger.info({ userId: (result.user as any)._id }, "User logged in successfully");
            // Set the JWT token in an HTTP-only cookie
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                message: "Login successful",
                user: result.user,
                token: result.token,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in login middleware"
            );
            
            if (error.message === "Invalid credentials") {
                res.status(401).json({
                    message: "Invalid credentials",
                });
            } else {
                res.status(500).json({
                    message: "Internal server error",
                    error: error.message,
                });
            }
        }
    }
}

export default UserMiddleware;