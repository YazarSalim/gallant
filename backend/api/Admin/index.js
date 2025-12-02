import express from 'express';
import clientRouter from './Client/index.js'
import siteRouter   from './Site/index.js'
import jobRouter from './Job/index.js';
import kpiRouter from './Kpi/index.js';
import profileRouter from './Profile/index.js'
import userRouter from './User/index.js'

const router = express.Router();


router.use('/client',clientRouter)
router.use('/site',siteRouter)
router.use('/job',jobRouter)
router.use('/kpi',kpiRouter)
router.use('/profile',profileRouter)
router.use('/user',userRouter)

export default router