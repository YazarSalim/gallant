import express from 'express';
import auth from '../../middleware/auth.js';
import controller from './controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/turnaroudexecution/createTurnAroundExecution:
 *   post:
 *     summary: Create a new Turn Around Execution entry
 *     description: Creates a new record with client, site, job and KPI details.
 *     tags:
 *       - TurnAroundExecution
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               clientId:
 *                 type: integer
 *                 example: 3
 *               siteId:
 *                 type: integer
 *                 example: 4
 *               jobId:
 *                 type: integer
 *                 example: 7
 *               directEarned:
 *                 type: array
 *                 description: Direct earned KPI summary array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     value:
 *                       type: number
 *                 example:
 *                   - label: "Planned Earn Period"
 *                     value: 150
 *                   - label: "Earn Period"
 *                     value: 120
 *                   - label: "Earn Cumulative"
 *                     value: 300
 *                   - label: "Actual Earn Cumulative"
 *                     value: 280
 *               percentComplete:
 *                 type: array
 *                 description: Percent complete KPI summary array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     value:
 *                       type: number
 *                 example:
 *                   - label: "Planned Earn Period"
 *                     value: 70
 *                   - label: "Actual Earn Period"
 *                     value: 65
 *                   - label: "Baseline Planned Cumulative"
 *                     value: 90
 *                   - label: "Actual Earn Cumulative"
 *                     value: 85
 *
 *     responses:
 *       201:
 *         description: Entry created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/createTurnAroundExecution", auth, controller.createTurnAroundExecution);

/**
 * @swagger
 * /api/turnaroukdexecution/getAllTurnAroundExecutionEntries:
 *   get:
 *     summary: Get all Turn Around Execution entries
 *     description: Fetch paginated list of all TurnAroundExecution entries with optional filters.
 *     tags:
 *       - TurnAroundExecution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Page number (default: 1)"
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Items per page (default: 10)"
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: "Search by client, site, job"
 *         example: "maintenance"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: "Filter entries from start date"
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: "Filter entries until end date"
 *         example: "2025-01-31"
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Filter by client ID"
 *         example: 3
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Filter by site ID"
 *         example: 4
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Filter by job ID"
 *         example: 7
 *
 *     responses:
 *       200:
 *         description: "Paginated list of entries fetched successfully"
 *       500:
 *         description: "Server error"
 */

router.get("/getAllTurnAroundExecutionEntries",auth,controller.getAllTurnAroundExecutionEntries)

/**
 * @swagger
 * /api/turnaroudexecution/getTurnAroundExecutionById/{id}:
 *   get:
 *     summary: Get Turn Around Execution entry by ID
 *     description: Fetch a single TurnAroundExecution entry using its ID.
 *     tags:
 *       - TurnAroundExecution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the TurnAroundExecution entry
 *     responses:
 *       200:
 *         description: Record fetched successfully
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
 *                       type: integer
 *                       example: 1
 *                     entryDate:
 *                       type: string
 *                       example: "2025-02-01"
 *                     clientId:
 *                       type: integer
 *                       example: 3
 *                     siteId:
 *                       type: integer
 *                       example: 4
 *                     jobId:
 *                       type: integer
 *                       example: 2
 *                     directEarned:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: "Earn Period"
 *                           value:
 *                             type: number
 *                             example: 120
 *                     percentComplete:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             example: "Actual Earn Cumulative"
 *                           value:
 *                             type: number
 *                             example: 45
 *       404:
 *         description: Entry not found
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
 *                   example: Entry not found
 *       500:
 *         description: Server error
 */

router.get("/getTurnAroundExecutionById/:id",auth,controller.getTurnAroundExecutionById)
/**
 * @swagger
 * /api/turnaroundexecution/updateTurnAroundExecution/{id}:
 *   put:
 *     summary: Update an existing Turn Around Execution entry
 *     description: Updates entry date, client, site, job and KPI details for a specific entry.
 *     tags:
 *       - TurnAroundExecution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the entry to update
 *         example: 12
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-20"
 *               clientId:
 *                 type: integer
 *                 example: 3
 *               siteId:
 *                 type: integer
 *                 example: 4
 *               jobId:
 *                 type: integer
 *                 example: 7
 *               directEarned:
 *                 type: array
 *                 description: Direct earned KPI values
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     value:
 *                       type: number
 *                 example:
 *                   - label: "Planned Earn Period"
 *                     value: 150
 *                   - label: "Earn Period"
 *                     value: 120
 *                   - label: "Earn Cumulative"
 *                     value: 300
 *                   - label: "Actual Earn Cumulative"
 *                     value: 280
 *               percentComplete:
 *                 type: array
 *                 description: Percent complete KPI values
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     value:
 *                       type: number
 *                 example:
 *                   - label: "Planned Earn Period"
 *                     value: 70
 *                   - label: "Actual Earn Period"
 *                     value: 65
 *                   - label: "Baseline Planned Cumulative"
 *                     value: 90
 *                   - label: "Actual Earn Cumulative"
 *                     value: 85
 *
 *     responses:
 *       200:
 *         description: Turn Around Execution updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Entry not found
 *       500:
 *         description: Server error
 */
router.put("/updateTurnAroundExecution/:id", auth, controller.updateTurnAroundExecution);

/**
 * @swagger
 * /api/turnaroudexecution/deleteTurnAroundExecution/{id}:
 *   delete:
 *     summary: Soft delete a Turn Around Execution entry
 *     description: Marks a TurnAroundExecution entry as deleted instead of permanent delete.
 *     tags:
 *       - TurnAroundExecution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the TurnAroundExecution entry to delete
 *     responses:
 *       200:
 *         description: Deleted successfully
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
 *                   example: TurnAroundExecution deleted successfully
 *       404:
 *         description: Entry not found
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
 *                   example: Entry not found
 *       500:
 *         description: Server error
 */

router.delete('/deleteTurnAroundExecution/:id',auth,controller.deleteTurnAroundExecution)

/**
 * @swagger
 * /api/turnaroudexecution/getTurnAroundExecutionSummary:
 *   get:
 *     tags:
 *       - TurnAroundExecution
 *     summary: Get Turn Around Execution Summary
 *     description: Fetch summary results for the given client, site, job, and date range.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *       - in: query
 *         name: siteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Site ID
 *       - in: query
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start of date range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End of date range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing or invalid input values
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Server error
 */

router.get('/getTurnAroundExecutionSummary',auth,controller.getTurnAroundExecutionSummary)

router.get('/exportTurnAroundExecution',auth,controller.exportTurnAroundExecution)
export default router;