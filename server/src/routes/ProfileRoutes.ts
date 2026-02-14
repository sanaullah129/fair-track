import { Router } from "express";
import ProfileMiddleware from "../middlewares/Profiles/Profile.middleware";

const router = Router();
const profileMiddleware = new ProfileMiddleware();

router.post('/', (req, res) => profileMiddleware.createProfile(req, res));
router.get('/user/:userId', (req, res) => profileMiddleware.getProfilesByUser(req, res));

export default router;
