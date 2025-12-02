import express from 'express';
import controller from './controller.js';
import auth from '../../../middleware/auth.js';
import { activityLogger } from '../../../middleware/activityLogger.js';

const router = express.Router();

router.use(auth, activityLogger);

router.post('/savevalues', controller.saveKpiValuesController)
/**
 * @swagger
 * /api/admin/kpi/getAllKpiEntries:
 *   get:
 *     summary: Get all KPI entry logs *
 *     description: Returns a list of all KPI entries with pagination *
 *     tags:
 *       - KPI Entries
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of entries per page *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter entries *
 *     responses:
 *       200:
 *         description: KPI entries retrieved successfully *
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
 *                         type: string
 *                         example: "1"
 *                       entryDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-11-25"
 *                       client:
 *                         type: object
 *                         properties:
 *                           clientName:
 *                             type: string
 *                             example: "Client A"
 *                       site:
 *                         type: object
 *                         properties:
 *                           siteName:
 *                             type: string
 *                             example: "Site 1"
 *                       job:
 *                         type: object
 *                         properties:
 *                           jobName:
 *                             type: string
 *                             example: "Job X"
 *       404:
 *         description: No KPI entries found *
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
 *                   example: "No KPI entries found"
 */
router.get('/getAllKpiEntries', controller.getKpiEntryLogs);

/**
 * @swagger
 * /api/admin/kpi/kpiSummaryValues:
 *   get:
 *     summary: Get KPI summary values *
 *     description: Returns summarized KPI values for a given client, site, and job within a date range *
 *     tags:
 *       - KPI Entries
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the client *
 *       - in: query
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site *
 *       - in: query
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job *
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD) *
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD) *
 *     responses:
 *       200:
 *         description: KPI summary retrieved successfully *
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
 *                       kpiId:
 *                         type: string
 *                         example: "kpi1"
 *                       categoryId:
 *                         type: string
 *                         example: "cat1"
 *                       totalValue:
 *                         type: number
 *                         example: 125.5
 *       400:
 *         description: Missing or invalid parameters *
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
 *                   example: "Missing required query parameters"
 */
router.get('/kpiSummaryValues', controller.summaryKpiValuesController);

/**
 * @swagger
 * /api/admin/kpi/getKpiValuesById:
 *   get:
 *     summary: Get KPI values by IDs *
 *     description: Returns KPI entries for a specific client, site, job, and date *
 *     tags:
 *       - KPI Entries
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the client *
 *       - in: query
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site *
 *       - in: query
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job *
 *       - in: query
 *         name: entryDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of KPI entry (YYYY-MM-DD) *
 *     responses:
 *       200:
 *         description: KPI values retrieved successfully *
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
 *                       kpiId:
 *                         type: string
 *                         example: "kpi1"
 *                       value:
 *                         type: number
 *                         example: 12.5
 *       400:
 *         description: Missing or invalid parameters *
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
 *                   example: "Missing required query parameters"
 */
router.get('/getKpiValuesById', controller.getKpiValuesController);


router.put("/kpi-entry-log/:entryId", controller.updateKpiValuesController);
/**
 * @swagger
 * /api/admin/kpi/delete-kpiEntries/{id}:
 *   patch:
 *     summary: Soft delete a KPI entry *
 *     description: Marks a KPI entry as deleted by its ID *
 *     tags:
 *       - KPI Entries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the KPI entry to delete *
 *     responses:
 *       200:
 *         description: KPI entry deleted successfully *
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
 *                   example: "KPI entry deleted successfully"
 *       404:
 *         description: KPI entry not found *
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
 *                   example: "KPI entry not found"
 *       400:
 *         description: Invalid ID supplied *
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
 *                   example: "Invalid ID parameter"
 */
router.patch("/delete-kpiEntries/:id", controller.deleteKpiEntry);


router.get("/exportFixedSummary",auth,controller.exportFixedSummary)
export default router;