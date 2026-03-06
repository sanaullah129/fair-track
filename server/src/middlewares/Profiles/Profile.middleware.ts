import { Request, Response } from "express";
import ProfileController from "../../controllers/Profiles/Profile.controller";
import logger from "../../configs/loggerConfig";
import { validateCreateProfileData, validateUpdateProfileData } from "./validations";
import { IProfileModel } from "../../models/IModels";

class ProfileMiddleware {
    private profileController = new ProfileController();

    public async createProfile(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Create profile request received");
            const { name, userId } = req.body as Partial<IProfileModel>;
            const userId_from_token = req.user?.userId;

            if (!validateCreateProfileData(req.body)) {
                logger.warn({ name, userId }, "Invalid profile data");
                res.status(400).json({ message: "Invalid profile data" });
                return;
            }

            // Check for duplicate profile name per user
            const existingProfile = await this.profileController.getProfileByUserAndName(userId!, name!);
            if (existingProfile) {
                logger.warn({ name, userId }, "Profile already exists for this user");
                res.status(409).json({ message: "Profile name already exists" });
                return;
            }

            const newProfile = await this.profileController.createProfile({
                name: name?.trim(),
                userId,
                createdBy: userId_from_token!,
                updatedBy: userId_from_token!,
            });

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
            console.log("User ID from request params:", userId);

            if (!userId || userId === "undefined") {
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

    public async getProfile(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get profile request received");
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                logger.warn("Profile ID not provided");
                res.status(400).json({ message: "Profile ID is required" });
                return;
            }

            const profile = await this.profileController.getProfileById(id as string);
            if (!profile) {
                logger.warn({ profileId: id }, "Profile not found");
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            logger.info({ profileId: id }, "Profile fetched successfully");
            res.status(200).json({
                message: "Profile fetched successfully",
                profile,
            });
        } catch (error: any) {
            logger.error({ error: error.message }, "Error in get profile middleware");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    public async updateProfile(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Update profile request received");
            const { id } = req.params;
            const { name } = req.body as Partial<IProfileModel>;

            if (!id || Array.isArray(id)) {
                logger.warn("Profile ID not provided");
                res.status(400).json({ message: "Profile ID is required" });
                return;
            }

            if (!validateUpdateProfileData(req.body)) {
                logger.warn({ profileId: id }, "Invalid update data");
                res.status(400).json({ message: "Invalid profile data" });
                return;
            }

            const existingProfile = await this.profileController.getProfileById(id as string);
            if (!existingProfile) {
                logger.warn({ profileId: id }, "Profile not found");
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            const updatedData: Partial<IProfileModel> = {};
            if (name) updatedData.name = name.trim();
            updatedData.updatedBy = req.user?.userId!;

            const updatedProfile = await this.profileController.updateProfile(id as string, updatedData);

            logger.info({ profileId: id }, "Profile updated successfully");
            res.status(200).json({
                message: "Profile updated successfully",
                profile: updatedProfile,
            });
        } catch (error: any) {
            logger.error({ error: error.message }, "Error in update profile middleware");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    public async deleteProfile(
        req: Request,
        res: Response,
    ): Promise<void> {
        const { id } = req.params;
        const userId = req.user?.userId;

        try {
            logger.info("Delete profile request received");

            if (!id || Array.isArray(id)) {
                logger.warn("Profile ID not provided");
                res.status(400).json({ message: "Profile ID is required" });
                return;
            }

            const existingProfile = await this.profileController.getProfileById(id as string);
            if (!existingProfile) {
                logger.warn({ profileId: id }, "Profile not found");
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            await this.profileController.deleteProfile(id as string, userId!);

            logger.info({ profileId: id }, "Profile deleted successfully");
            res.status(200).json({
                message: "Profile deleted successfully",
            });
        } catch (error: any) {
            if (error.message === "Cannot delete the default 'Self' profile") {
                logger.warn({ profileId: id }, error.message);
                res.status(400).json({ message: error.message });
                return;
            }
            logger.error({ error: error.message }, "Error in delete profile middleware");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}

export default ProfileMiddleware;
