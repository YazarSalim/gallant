import express from 'express'
import adminRouter from '../api/Admin/index.js';
import authRouter from '../api/Auth/index.js'

const router = express.Router();

router.use('/admin',adminRouter)
router.use('/auth',authRouter)

export default router;