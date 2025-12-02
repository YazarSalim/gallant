import express from 'express';
import auth from '../../../middleware/auth.js';
import validator from './validator.js'
import controller from './controller.js';
import { activityLogger } from '../../../middleware/activityLogger.js';

const router = express.Router();
router.use(auth, activityLogger);
/**
 * @swagger
 * /api/admin/user/createUser:
 *   post:
 *     tags:
 *       - Admin/User Management
 *     summary: Create a new user
 *     description: Endpoint to create a new user. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *                 description: Username of the user
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *                 description: Email address of the user
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *                 description: Phone number of the user
 *             required:
 *               - username
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: User created successfully
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
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone:
 *                       type: string
 *                       example: "9876543210"
 *       400:
 *         description: Validation error or missing fields
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
 *                   example: "Username is required"
 */



router.post('/createUser',validator.userSchema,controller.createUser) 

/**
 * @swagger
 * /api/admin/user/getAllUsers:
 *   get:
 *     tags:
 *       - Admin/User Management
 *     summary: Get paginated list of users
 *     description: Returns a paginated list of users. Supports search (username/email/phone) and pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ""
 *         description: Search term to match username, email or phone
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "johndoe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       phone:
 *                         type: string
 *                         example: "9876543210"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-27T12:11:06.121Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 125
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 13
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Internal server error
 */
router.get('/getAllUsers', controller.getAllUsers);

/**
 * @swagger
 * /api/admin/user/getUserById/{id}:
 *   get:
 *     tags:
 *       - Admin/User Management
 *     summary: Get user by ID
 *     description: Fetch details of a specific user using their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details fetched successfully
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
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone:
 *                       type: string
 *                       example: "9876543210"
 *                     role:
 *                       type: string
 *                       example: admin
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

router.get(`/getUserById/:id`,controller.getUserById)
/**
 * @swagger
 * /api/admin/user/updateUser/{id}:
 *   post:
 *     tags:
 *       - Admin/User Management
 *     summary: Update user details
 *     description: Update a user's information by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updatedUser
 *               email:
 *                 type: string
 *                 example: updated@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543211"
 *             required:
 *               - username
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 3
 *                     username:
 *                       type: string
 *                       example: updatedUser
 *                     email:
 *                       type: string
 *                       example: updated@gmail.com
 *                     phone:
 *                       type: string
 *                       example: "9876543211"
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.post("/updateUser/:id",controller.updateUser)

/**
 * @swagger
 * /api/admin/user/deleteUser/{id}:
 *   delete:
 *     tags:
 *       - Admin/User Management
 *     summary: Soft delete a user
 *     description: Marks a user as deleted without removing data from the database.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

    router.delete('/deleteUser/:id',controller.softDeleteUser)

export default router