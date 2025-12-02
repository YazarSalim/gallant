import express from 'express'
import adminRouter from '../api/Admin/index.js';
import authRouter from '../api/Auth/index.js'
import logsRouter from '../api/ActivityLog/index.js'
import turnAroundExecutionRouter from '../api/TurnAroundExecution/index.js'

const router = express.Router();

router.use('/admin',adminRouter)
router.use('/auth',authRouter)
router.use('/logs',logsRouter)
router.use("/turnaroudexecution",turnAroundExecutionRouter)

export default router;