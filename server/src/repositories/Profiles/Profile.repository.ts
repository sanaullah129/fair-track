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
        const query: any = { userId, deletedAt: null };
        if (fetchActive === true) {
            query.isActive = true;
        } else if (fetchActive === false) {
            query.isActive = false;
        }
        logger.info({ query }, "Finding profiles with query");
        // If fetchActive is undefined, no isActive filter applied (returns all non-deleted)
        const profiles = await ProfileModel.find(query).sort({ createdAt: -1 });
        return profiles;
    }

    public async findProfileById(id: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findOne({ _id: id, deletedAt: null });
        return profile;
    }

    public async findProfileByUserAndName(userId: string, name: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findOne({ userId, name, deletedAt: null });
        return profile;
    }

    public async updateProfile(id: string, updates: Partial<IProfileModel>): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findByIdAndUpdate(id, updates, { new: true });
        return profile;
    }

    public async deleteProfile(id: string, deletedBy: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findByIdAndUpdate(
            id,
            {
                deletedAt: new Date(),
                deletedBy,
            },
            { new: true }
        );
        return profile;
    }
}

export default ProfileRepository;
