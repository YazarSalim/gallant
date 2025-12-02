import express from "express";
import controller from "./controller.js";
import validator from "./validator.js";
import auth from "../../../middleware/auth.js";
import { activityLogger } from "../../../middleware/activityLogger.js";

const router = express.Router();



router.use(auth, activityLogger);
/**
 * @swagger
 * /api/admin/site/createsite:
 *   post:
 *    tags:
 *      - Admin/Site Management
 *    summary: Add a new site
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - siteName
 *              - siteCode
 *              - clientId
 *            properties:
 *              siteName:
 *                type: string
 *                example: kazhakuttam
 *              siteCode:
 *                type: string
 *                example: SIT001
 *              clientId:
 *                type: number
 *                example: 5
 *    responses:
 *      201:
 *        description: Site created successfully
 */
router.post("/createsite",validator.validateSite, controller.createSite);

/**
 * @swagger
 * /api/admin/site/updatesite/{id}:
 *   put:
 *     tags:
 *       - Admin/Site Management
 *     summary: Update a site
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *            type: number
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *              schema:
 *                type: object
 *     responses:
 *        200:
 *          description: Site updated successfully
 */
router.put("/updatesite/:id",validator.validateSite, controller.updateSite);

/**
 * @swagger
 * /api/admin/site/deletesite/{id}:
 *   delete:
 *     tags:
 *       - Admin/Site Management
 *     summary: Delete a site
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *            type: number
 *     responses:
 *        200:
 *          description: Site deleted successfully
 */
router.patch("/deletesite/:id", controller.deleteSite);
/**
 * @swagger
 * /api/admin/site:
 *   get:
 *     tags:
 *       - Admin/Site Management
 *     summary: Get all sites with pagination
 *     description: Retrieve a paginated list of sites with linked client names.
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
 *         description: List of sites with pagination
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
 *                       siteCode:
 *                         type: string
 *                       siteName:
 *                         type: string
 *                       clientName:
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
router.get("/allSites",controller.getAllSites)

/**
 * @swagger
 * /api/admin/site/getSiteById/{id}:
 *   get:
 *     summary: Get a single site by its ID *
 *     description: Returns the details of a site given its unique ID *
 *     tags:
 *       - Admin/Site Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the site *
 *     responses:
 *       200:
 *         description: Site retrieved successfully *
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
 *                       example: "12345"
 *                     siteName:
 *                       type: string
 *                       example: "Main Site"
 *                     siteCode:
 *                       type: string
 *                       example: "MS001"
 *                     clientId:
 *                       type: string
 *                       example: "67890"
 *       404:
 *         description: Site not found *
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
 *                   example: "Site not found"
 */
router.get("/getSiteById/:id", controller.getSitesById);


/**
 * @swagger
 * /api/admin/site/{clientId}:
 *   get:
 *     summary: Get all sites for a specific client *
 *     description: Returns a list of sites associated with the given client ID *
 *     tags:
 *       - Admin/Site Management
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the client *
 *     responses:
 *       200:
 *         description: Sites retrieved successfully *
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
 *                         example: "12345"
 *                       siteName:
 *                         type: string
 *                         example: "Main Site"
 *                       siteCode:
 *                         type: string
 *                         example: "MS001"
 *                       clientId:
 *                         type: string
 *                         example: "67890"
 *       404:
 *         description: No sites found for the given client *
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
 *                   example: "No sites found for this client"
 */
router.get("/:clientId", controller.getSitesByClient);


export default router;
