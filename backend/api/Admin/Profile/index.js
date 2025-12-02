import express from 'express';
import controller from './controller.js';
import auth from '../../../middleware/auth.js';
import { activityLogger } from '../../../middleware/activityLogger.js';
import uploadProfile from '../../../middleware/uploadProfile.js';

const router = express.Router();

router.use(auth, activityLogger);

/**
 * @swagger
 * /api/admin/profile/:
 *   get:
 *     summary: Get user profile *
 *     description: Fetches the profile information of a user *
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to fetch *
 *     responses:
 *       200:
 *         description: User profile fetched successfully *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: User profile object *
 *       404:
 *         description: User not found *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       400:
 *         description: Invalid email supplied *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid email parameter"
 */
router.get("/", controller.getUserProfile);

router.put('/updateProfile',auth,uploadProfile.single("profilePhoto"),controller.updateProfile)
export default router;