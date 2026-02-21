import { Router } from "express";
import ProfileMiddleware from "../middlewares/Profiles/Profile.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import auditMiddleware from "../middlewares/audit.middleware";

const router = Router();
const profileMiddleware = new ProfileMiddleware();

// Require authentication for profile creation and listing
router.use(authMiddleware);
router.use(auditMiddleware);

router.post('/', (req, res) => profileMiddleware.createProfile(req, res));
router.get('/user/:userId', (req, res) => profileMiddleware.getProfilesByUser(req, res));

export default router;
