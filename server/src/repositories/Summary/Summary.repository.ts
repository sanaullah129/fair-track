import SummaryModel from '../../models/Summary.model';
import ProfileRepository from '../Profiles/Profile.repository';
import type { ISummaryModel, ITransactionModel } from '../../models/IModels';
import logger from '../../configs/loggerConfig';

class SummaryRepository {
  private _profileRepository: ProfileRepository;

  constructor() {
    this._profileRepository = new ProfileRepository();
  }

  public async getSummaryByProfileId(profileId: string): Promise<ISummaryModel | null> {
    try {
      logger.info({ profileId }, 'Fetching summary for profile');
      const summary = await SummaryModel.findOne({ profileId, deletedAt: null });
      return summary;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error fetching summary');
      throw error;
    }
  }

  /**
   * Create a new summary entry for a profile
   * Validates that the profile exists before creating the summary
   * Fire and forget operation with error logging
   */
  public createSummaryForProfile(profileId: string, transaction?: Partial<ITransactionModel>): void {
    try {
      if (!profileId) {
        logger.warn({ profileId }, 'Skipping summary creation - profileId missing');
        return;
      }

      // Fire and forget - don't await
      this._performSummaryCreation(profileId, transaction).catch((error) => {
        logger.error(
          { profileId, error: error.message },
          'Error creating summary entry for profile'
        );
      });
    } catch (error: any) {
      logger.error(
        { error: error.message },
        'Error in createSummaryForProfile'
      );
    }
  }

  /**
   * Update summary on transaction creation
   * Fire and forget operation with error logging
   */
  public updateSummaryOnTransactionCreate(transaction: Partial<ITransactionModel>): void {
    try {
      const { profileId, type, amount } = transaction;

      if (!profileId || !type || !amount) {
        logger.warn(
          { profileId, type, amount },
          'Skipping summary update - missing required transaction fields'
        );
        return;
      }

      // Create or update summary entry for this transaction
      this.createSummaryForProfile(profileId, transaction);
    } catch (error: any) {
      logger.error(
        { error: error.message },
        'Error in updateSummaryOnTransactionCreate'
      );
    }
  }

  /**
   * Update summary on transaction update
   * Reverses old transaction effect and applies new transaction effect
   * Fire and forget operation with error logging
   */
  public updateSummaryOnTransactionUpdate(
    oldTransaction: Partial<ITransactionModel>,
    newTransaction: Partial<ITransactionModel>
  ): void {
    try {
      const { profileId, type: oldType, amount: oldAmount } = oldTransaction;
      const { type: newType, amount: newAmount } = newTransaction;

      if (!profileId) {
        logger.warn({ profileId }, 'Skipping summary update - profileId missing');
        return;
      }

      // Fire and forget - don't await
      this._performSummaryUpdateOnEdit(
        profileId,
        oldType,
        oldAmount,
        newType,
        newAmount
      ).catch((error) => {
        logger.error(
          { profileId, error: error.message },
          'Error updating summary on transaction update'
        );
      });
    } catch (error: any) {
      logger.error(
        { error: error.message },
        'Error in updateSummaryOnTransactionUpdate'
      );
    }
  }

  /**
   * Update summary on transaction deletion
   * Reverses the transaction's effect on summary
   * Fire and forget operation with error logging
   */
  public updateSummaryOnTransactionDelete(transaction: Partial<ITransactionModel>): void {
    try {
      const { profileId, type, amount } = transaction;

      if (!profileId || !type || !amount) {
        logger.warn(
          { profileId, type, amount },
          'Skipping summary update - missing required transaction fields'
        );
        return;
      }

      // Fire and forget - don't await
      this._performSummaryUpdate(profileId, type, amount, 'delete').catch((error) => {
        logger.error(
          { profileId, error: error.message },
          'Error updating summary on transaction delete'
        );
      });
    } catch (error: any) {
      logger.error(
        { error: error.message },
        'Error in updateSummaryOnTransactionDelete'
      );
    }
  }

  /**
   * Private: Perform the actual summary update for create/delete operations
   */
  private async _performSummaryUpdate(
    profileId: string,
    type: string,
    amount: number,
    operation: 'create' | 'delete'
  ): Promise<void> {
    try {
      const isCreating = operation === 'create';
      const multiplier = isCreating ? 1 : -1;

      const updateFields: any = {};

      // Calculate balance and income/expense changes
      if (type === 'credit') {
        updateFields.$inc = {
          totalIncome: multiplier * amount,
          currentBalance: multiplier * amount,
        };
      } else if (type === 'debit') {
        updateFields.$inc = {
          totalExpense: multiplier * amount,
          currentBalance: -multiplier * amount,
        };
      }

      const result = await SummaryModel.findOneAndUpdate(
        { profileId, deletedAt: null },
        updateFields,
        { new: true }
      );

      if (!result) {
        logger.warn({ profileId }, `Profile not found for summary ${operation}`);
        return;
      }

      logger.info(
        {
          profileId,
          operation,
          type,
          amount,
          currentBalance: result.currentBalance,
          totalIncome: result.totalIncome,
          totalExpense: result.totalExpense,
        },
        `Summary updated successfully on transaction ${operation}`
      );
    } catch (error: any) {
      logger.error(
        { profileId, operation, type, amount, error: error.message },
        `Error performing summary update for ${operation}`
      );
      throw error;
    }
  }

  /**
   * Private: Perform the actual summary update for edit operations
   * Reverses old transaction effect and applies new transaction effect
   */
  private async _performSummaryUpdateOnEdit(
    profileId: string,
    oldType: string | undefined,
    oldAmount: number | undefined,
    newType: string | undefined,
    newAmount: number | undefined
  ): Promise<void> {
    try {
      const updateFields: any = { $inc: {} };

      // Reverse old transaction effect
      if (oldType && oldAmount) {
        if (oldType === 'credit') {
          updateFields.$inc.totalIncome = -oldAmount;
          updateFields.$inc.currentBalance = -oldAmount;
        } else if (oldType === 'debit') {
          updateFields.$inc.totalExpense = -oldAmount;
          updateFields.$inc.currentBalance = oldAmount;
        }
      }

      // Apply new transaction effect
      if (newType && newAmount) {
        if (newType === 'credit') {
          updateFields.$inc.totalIncome = (updateFields.$inc.totalIncome || 0) + newAmount;
          updateFields.$inc.currentBalance = (updateFields.$inc.currentBalance || 0) + newAmount;
        } else if (newType === 'debit') {
          updateFields.$inc.totalExpense = (updateFields.$inc.totalExpense || 0) + newAmount;
          updateFields.$inc.currentBalance = (updateFields.$inc.currentBalance || 0) - newAmount;
        }
      }

      const result = await SummaryModel.findOneAndUpdate(
        { profileId, deletedAt: null },
        updateFields,
        { new: true }
      );

      if (!result) {
        logger.warn({ profileId }, 'Profile not found for summary update on edit');
        return;
      }

      logger.info(
        {
          profileId,
          oldType,
          oldAmount,
          newType,
          newAmount,
          currentBalance: result.currentBalance,
          totalIncome: result.totalIncome,
          totalExpense: result.totalExpense,
        },
        'Summary updated successfully on transaction edit'
      );
    } catch (error: any) {
      logger.error(
        {
          profileId,
          oldType,
          oldAmount,
          newType,
          newAmount,
          error: error.message,
        },
        'Error performing summary update on transaction edit'
      );
      throw error;
    }
  }

  /**
   * Private: Create a summary entry for a profile
   * Validates profile existence before creation
   */
  private async _performSummaryCreation(
    profileId: string,
    transaction?: Partial<ITransactionModel>
  ): Promise<void> {
    try {
      // Check if summary already exists
      const existingSummary = await SummaryModel.findOne({ profileId, deletedAt: null });
      if (existingSummary) {
        logger.info({ profileId }, 'Summary already exists for profile');

        if (transaction?.type && transaction.amount) {
          await this._performSummaryUpdate(profileId, transaction.type, transaction.amount, 'create');
        }
        return;
      }

      // Validate that the profile exists
      const profile = await this._profileRepository.findProfileById(profileId);
      if (!profile) {
        logger.warn(
          { profileId },
          'Profile not found - skipping summary creation'
        );
        return;
      }

      const initialValues = {
        currentBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
      };

      if (transaction?.type && transaction.amount) {
        if (transaction.type === 'credit') {
          initialValues.currentBalance = transaction.amount;
          initialValues.totalIncome = transaction.amount;
        } else if (transaction.type === 'debit') {
          initialValues.currentBalance = -transaction.amount;
          initialValues.totalExpense = transaction.amount;
        }
      }

      // Create new summary entry with calculated values for the first transaction
      const newSummary = new SummaryModel({
        profileId,
        currentBalance: initialValues.currentBalance,
        totalIncome: initialValues.totalIncome,
        totalExpense: initialValues.totalExpense,
      });

      const savedSummary = await newSummary.save();

      logger.info(
        {
          profileId,
          summaryId: (savedSummary as any)._id,
          currentBalance: savedSummary.currentBalance,
          totalIncome: savedSummary.totalIncome,
          totalExpense: savedSummary.totalExpense,
        },
        'Summary created successfully for profile'
      );
    } catch (error: any) {
      logger.error(
        { profileId, error: error.message },
        'Error performing summary creation'
      );
      throw error;
    }
  }
}

export default SummaryRepository;
