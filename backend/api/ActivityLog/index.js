import express from 'express';
import auth from '../../middleware/auth.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import controller from './controller.js';

const router = express.Router();

router.use(auth,activityLogger)
router.get("/getAllActivityLogs",controller.getAllActivityLogs)
export default router;