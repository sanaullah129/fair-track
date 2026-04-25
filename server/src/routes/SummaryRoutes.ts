import { Router } from 'express';
import SummaryMiddleware from '../middlewares/Summary/Summary.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import auditMiddleware from '../middlewares/audit.middleware';

const router = Router();
const summaryMiddleware = new SummaryMiddleware();

router.use(authMiddleware);
router.use(auditMiddleware);

router.get('/:profileId', (req, res) => summaryMiddleware.getSummaryByProfileId(req, res));

export default router;
