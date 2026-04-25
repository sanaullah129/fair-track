import SummaryRepository from '../../repositories/Summary/Summary.repository';
import logger from '../../configs/loggerConfig';
import type { ISummaryModel } from '../../models/IModels';

class SummaryController {
  private _summaryRepository: SummaryRepository;

  constructor() {
    this._summaryRepository = new SummaryRepository();
  }

  public async getSummaryByProfileId(profileId: string): Promise<ISummaryModel | null> {
    try {
      logger.info({ profileId }, 'Fetching summary via controller');
      const summary = await this._summaryRepository.getSummaryByProfileId(profileId);
      if (!summary) {
        logger.warn({ profileId }, 'Summary not found');
      }
      return summary;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error fetching summary');
      throw error;
    }
  }
}

export default SummaryController;
