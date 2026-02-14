import { IProfileModel } from "../../models/IModels";
import ProfileModel from "../../models/Profile.model";

class ProfileRepository {
    constructor() {}

    public async createProfile(profileData: Partial<IProfileModel>): Promise<IProfileModel> {
        const newProfile = new ProfileModel(profileData);
        const saved = await newProfile.save();
        return saved.toObject();
    }

    public async findProfilesByUserId(userId: string): Promise<IProfileModel[]> {
        const profiles = await ProfileModel.find({ userId }).sort({ createdAt: -1 });
        return profiles;
    }

    public async findProfileById(id: string): Promise<IProfileModel | null> {
        const profile = await ProfileModel.findById(id);
        return profile;
    }
}

export default ProfileRepository;
