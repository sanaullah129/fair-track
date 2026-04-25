import { Request, Response } from 'express';
import SummaryController from '../../controllers/Summary/Summary.controller';
import logger from '../../configs/loggerConfig';

class SummaryMiddleware {
  private summaryController = new SummaryController();

  public async getSummaryByProfileId(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Get summary request received');
      let profileId = req.params.profileId;
      // If profileId is an array, take the first element
      if (Array.isArray(profileId)) profileId = profileId[0];
      // also allow query param fallback
      let pid = profileId || (req.query.profileId as string);
      if (Array.isArray(pid)) pid = pid[0];
      if (!pid) {
        logger.warn('profileId not provided');
        res.status(400).json({ message: 'profileId is required' });
        return;
      }
      const summary = await this.summaryController.getSummaryByProfileId(pid);
      if (!summary) {
        logger.warn({ profileId: pid }, 'Summary not found');
        res.status(404).json({ message: 'Summary not found' });
        return;
      }
      logger.info({ profileId: pid }, 'Summary fetched successfully');
      res.status(200).json({ message: 'Summary fetched successfully', summary });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error in get summary middleware');
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export default SummaryMiddleware;
