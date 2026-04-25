import ProfileRepository from "../../repositories/Profiles/Profile.repository";
import TransactionRepository from "../../repositories/Transactions/Transaction.repository";
import SummaryRepository from "../../repositories/Summary/Summary.repository";
import logger from "../../configs/loggerConfig";
import type { IProfileModel } from "../../models/IModels";

class ProfileController {
    private _profileRepository: ProfileRepository;
    private _transactionRepository: TransactionRepository;
    private _summaryRepository: SummaryRepository;
    constructor() {
        this._profileRepository = new ProfileRepository();
        this._transactionRepository = new TransactionRepository();
        this._summaryRepository = new SummaryRepository();
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

    public async getProfilesByUser(userId: string, fetchActive?: boolean): Promise<IProfileModel[]> {
        try {
            logger.info({ userId }, "Fetching profiles for user");
            const profiles = await this._profileRepository.findProfilesByUserId(userId, fetchActive);
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

    public async getProfileByUserAndName(userId: string, name: string): Promise<IProfileModel | null> {
        try {
            logger.info({ userId, name }, "Fetching profile by user and name");
            const profile = await this._profileRepository.findProfileByUserAndName(userId, name);
            return profile;
        } catch (error: any) {
            logger.error({ error: error.message }, "Error fetching profile by user and name");
            throw error;
        }
    }

    public async updateProfile(id: string, updates: Partial<IProfileModel>): Promise<IProfileModel | null> {
        try {
            logger.info({ profileId: id }, "Updating profile");
            const profile = await this._profileRepository.updateProfile(id, updates);
            if (!profile) {
                logger.warn({ profileId: id }, "Profile not found");
                return null;
            }
            logger.info({ profileId: id }, "Profile updated successfully");
            return profile;
        } catch (error: any) {
            logger.error({ error: error.message }, "Error updating profile");
            throw error;
        }
    }

    public async deleteProfile(id: string, userId: string): Promise<IProfileModel | null> {
        try {
            logger.info({ profileId: id }, "Deleting profile");

            // Get the profile to check if it's the "Self" profile
            const profile = await this._profileRepository.findProfileById(id);
            if (!profile) {
                logger.warn({ profileId: id }, "Profile not found");
                return null;
            }

            // Prevent deletion of "Self" profile
            if (profile.name === "Self") {
                logger.warn({ profileId: id, userId }, "Cannot delete Self profile");
                throw new Error("Cannot delete the default 'Self' profile");
            }

            // Get the "Self" profile to move transactions to
            const selfProfile = await this._profileRepository.findProfileByUserAndName(userId, "Self");
            if (!selfProfile) {
                logger.error({ userId }, "Self profile not found for user");
                throw new Error("Default profile not found");
            }

            // Move all transactions from this profile to the Self profile
            await this._transactionRepository.updateTransactionProfile(id, (selfProfile as any)._id.toString(), userId);

            // Migrate summary values from deleted profile to Self profile
            await this._summaryRepository.migrateSummaryOnProfileDelete(
                id,
                (selfProfile as any)._id.toString(),
                userId
            );

            // Soft delete the profile
            const deletedProfile = await this._profileRepository.deleteProfile(id, userId);
            logger.info({ profileId: id }, "Profile deleted successfully");
            return deletedProfile;
        } catch (error: any) {
            logger.error({ error: error.message }, "Error deleting profile");
            throw error;
        }
    }
}

export default ProfileController;
