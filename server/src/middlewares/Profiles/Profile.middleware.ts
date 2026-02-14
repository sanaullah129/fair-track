import { Request, Response } from "express";
import ProfileController from "../../controllers/Profiles/Profile.controller";
import logger from "../../configs/loggerConfig";

class ProfileMiddleware {
    private profileController = new ProfileController();

    public async createProfile(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Create profile request received");
            const { name, userId } = req.body;

            if (!name || !userId) {
                logger.warn({ name, userId }, "Invalid profile data");
                res.status(400).json({ message: "Invalid profile data" });
                return;
            }

            const newProfile = await this.profileController.createProfile({ name, userId });

            logger.info({ profileId: (newProfile as any)._id }, "Profile created successfully");
            res.status(201).json({
                message: "Profile created successfully",
                profile: newProfile,
            });
        } catch (error: any) {
            logger.error({ error: error.message }, "Error in create profile middleware");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    public async getProfilesByUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get profiles by user request received");
            const { userId } = req.params;

            if (!userId || Array.isArray(userId)) {
                logger.warn("User ID not provided");
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            const profiles = await this.profileController.getProfilesByUser(userId as string);

            logger.info({ userId }, "Profiles fetched successfully");
            res.status(200).json({
                message: "Profiles fetched successfully",
                profiles,
            });
        } catch (error: any) {
            logger.error({ error: error.message }, "Error in get profiles middleware");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}

export default ProfileMiddleware;
