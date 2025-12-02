import express from 'express';
import validator from './validator.js';
import controller from './controller.js';
import auth from '../../../middleware/auth.js';
import { activityLogger } from '../../../middleware/activityLogger.js';
const router = express.Router();

router.use(auth, activityLogger);
/**
 * @swagger
 * /api/admin/client/createclient:
 *   post:
 *     tags:
 *       - Admin/Client Management
 *     summary: Add a new client
 *     description: Create a new client with client code, name, and contact details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientCode
 *               - clientName
 *               - contact
 *             properties:
 *               clientCode:
 *                 type: string
 *                 example: CLT001
 *               clientName:
 *                 type: string
 *                 example: Gallant Security
 *               contact:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


router.post('/createclient',validator.validateClient,controller.createClient)


/**
 * @swagger
 * /api/admin/client/updateclient/{id}:
 *   put:
 *     tags:
 *       - Admin/Client Management
 *     summary: Edit an existing client
 *     description: Update client details such as name or contact.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 example: Updated Client Name
 *               contact:
 *                 type: string
 *                 example: "9876501234"
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */

router.put("/updateclient/:id",validator.validateClient,controller.editClient)

/**
 * @swagger
 * /api/admin/client/deleteclient/{id}:
 *   delete:
 *     tags:
 *       - Admin/Client Management
 *     summary: Delete a client (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Client deleted successfully
 */
router.delete('/deleteclient/:id', controller.deleteClient);


/**
 * @swagger
 * /api/admin/client:
 *   get:
 *     tags:
 *       - Admin/Client Management
 *     summary: Get all clients with pagination
 *     description: Fetch a paginated list of clients. Returns client details including clientCode, clientName, contact, and isDeleted.
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
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of clients with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       clientCode:
 *                         type: string
 *                         example: CLT001
 *                       clientName:
 *                         type: string
 *                         example: Gallant Security
 *                       contact:
 *                         type: string
 *                         example: "9876543210"
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Internal server error
 */
router.get("/",controller.getAllClients)

/**
 * @swagger
 * /api/admin/client/getClientById/{id}:
 *   get:
 *     summary: Get client details by ID
 *     tags:
 *       - Admin/Client Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the client
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved client details
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
 *                       type: string
 *                     clientName:
 *                       type: string
 *                     clientCode:
 *                       type: string
 *                     contact:
 *                       type: string
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

router.get("/getClientById/:id",controller.getClientById)

export default router;