import express from "express";
import validator from "./validator.js";
import controller from "./controller.js";
import auth from "../../../middleware/auth.js";
const router = express.Router();

/**
 * @swagger
 * /api/admin/job/createjob:
 *   post:
 *     tags:
 *       - Admin/Job Management
 *     summary: Add a new job
 *     description: Create a new job linked to a client and site
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobName
 *               - jobCode
 *               - clientId
 *               - siteId
 *             properties:
 *               jobName:
 *                 type: string
 *                 example: Security Patrol
 *               jobCode:
 *                 type: string
 *                 example: JOB001
 *               clientId:
 *                 type: integer
 *                 example: 1
 *               siteId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     jobCode:
 *                       type: string
 *                     jobName:
 *                       type: string
 *                     clientId:
 *                       type: integer
 *                     siteId:
 *                       type: integer
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/createjob",
  auth,
  validator.validateCreateJob,
  controller.createJob
);
/**
 * @swagger
 * /api/admin/job/updatejob/{id}:
 *   put:
 *     tags:
 *       - Admin/Job Management
 *     summary: Update a job
 *     description: Update job details by job ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the job to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobName:
 *                 type: string
 *                 example: Night Patrol
 *               jobId:
 *                 type: string
 *                 example: JOB002
 *               clientId:
 *                 type: integer
 *                 example: 1
 *               siteId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.put("/updatejob/:id", auth, controller.updateJob);
/**
 * @swagger
 * /api/admin/job/deletejob/{id}:
 *   delete:
 *     tags:
 *       - Admin/Job Management
 *     summary: Soft delete a job
 *     description: Marks a job as deleted (isDeleted = true)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the job to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job soft-deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deletejob/:id", auth, controller.deleteJob);

/**
 * @swagger
 * /api/admin/job:
 *   get:
 *     tags:
 *       - Admin/Job Management
 *     summary: Get all jobs with pagination
 *     description: Retrieve paginated list of jobs including clientName and siteName.
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
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of jobs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       jobCode:
 *                         type: string
 *                       jobName:
 *                         type: string
 *                       clientName:
 *                         type: string
 *                       siteName:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/", auth, controller.getAllJobs);

/**
 * @swagger
 * /api/admin/job/{siteId}:
 *   get:
 *     summary: Get all jobs under a specific site
 *     tags:
 *       - Admin/Job Management
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         description: ID of the site to fetch jobs for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched jobs for the given site
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
 *                         example: "123"
 *                       jobName:
 *                         type: string
 *                         example: "Security Officer"
 *                       jobCode:
 *                         type: string
 *                         example: "JOB-101"
 *                       clientId:
 *                         type: string
 *                         example: "45"
 *                       siteId:
 *                         type: string
 *                         example: "12"
 *       404:
 *         description: No jobs found for the given site
 *       500:
 *         description: Internal server error
 */
router.get("/:siteId", auth, controller.getJobsBySite);

export default router;
