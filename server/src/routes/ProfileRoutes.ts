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
router.get('/:id', (req, res) => profileMiddleware.getProfile(req, res));
router.put('/:id', (req, res) => profileMiddleware.updateProfile(req, res));
router.delete('/:id', (req, res) => profileMiddleware.deleteProfile(req, res));

export default router;
