import ProfileRepository from "../../repositories/Profiles/Profile.repository";
import logger from "../../configs/loggerConfig";
import type { IProfileModel } from "../../models/IModels";

class ProfileController {
    private _profileRepository: ProfileRepository;
    constructor() {
        this._profileRepository = new ProfileRepository();
    }

    public async createProfile(profileData: Partial<IProfileModel>): Promise<IProfileModel> {
        try {
            logger.info({ userId: profileData.userId }, "Creating profile");
            const profile = await this._profileRepository.createProfile(profileData);
            logger.info({ profileId: (profile as any)._id }, "Profile created successfully");
            return profile;
        } catch (error: any) {
            logger.error({ error: error.message }, "Error creating profile");
            throw error;
        }
    }

    public async getProfilesByUser(userId: string): Promise<IProfileModel[]> {
        try {
            logger.info({ userId }, "Fetching profiles for user");
            const profiles = await this._profileRepository.findProfilesByUserId(userId);
            return profiles;
        } catch (error: any) {
            logger.error({ error: error.message }, "Error fetching profiles");
            throw error;
        }
    }

    public async getProfileById(id: string): Promise<IProfileModel | null> {
        try {
            logger.info({ profileId: id }, "Fetching profile by id");
            const profile = await this._profileRepository.findProfileById(id);
            if (!profile) {
                logger.warn({ profileId: id }, "Profile not found");
            }
            return profile;
        } catch (error: any) {
            logger.error({ error: error.message }, "Error fetching profile");
            throw error;
        }
    }
}

export default ProfileController;
