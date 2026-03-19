import logger from "../../configs/loggerConfig";
import { IProfileModel } from "../../models/IModels";
import ProfileModel from "../../models/Profile.model";

class ProfileRepository {
    constructor() {}

    public async createProfile(profileData: Partial<IProfileModel>): Promise<IProfileModel> {
        const newProfile = new ProfileModel(profileData);
        const saved = await newProfile.save();
        return saved.toObject();
    }

    public async findProfilesByUserId(userId: string, fetchActive: boolean | undefined): Promise<IProfileModel[]> {
        const query: any = { userId };
        if (fetchActive === true) {
            query.isActive = true;
        } else if (fetchActive === false) {
            query.isActive = false;
        }
        logger.info({ query }, "Finding profiles with query");
        // If fetchActive is undefined, no isActive filter applied (returns all)
        const profiles = await ProfileModel.find(query).sort({ createdAt: -1 });
        return profiles;
    }

    public async findProfileById(id: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findById(id);
        return profile;
    }

    public async findProfileByUserAndName(userId: string, name: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findOne({ userId, name });
        return profile;
    }

    public async updateProfile(id: string, updates: Partial<IProfileModel>): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findByIdAndUpdate(id, updates, { new: true });
        return profile;
    }

    public async deleteProfile(id: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findByIdAndDelete(id);
        return profile;
    }
}

export default ProfileRepository;
