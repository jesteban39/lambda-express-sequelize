import {Router} from 'express'
import contactRoutes from './routes/contact'
import clientRoutes from './routes/client'
import flowRoutes from './routes/flow'
import processRoutes from './routes/process'
import serviceRoutes from './routes/service'
import companyRoutes from './routes/company'
import enterpriseRoutes from './routes/enterprise'
import userRoutes from './routes/user'
import backupRoutes from './routes/backup'
import vpnRoutes from './routes/vpn'
import navigationRoutes from './routes/navigation'
import storageRoutes from './routes/storage'

export const router = Router()

router.use('/Contact', contactRoutes)
router.use('/Client', clientRoutes)
router.use('/Flow', flowRoutes)
router.use('/Process', processRoutes)
router.use('/Service', serviceRoutes)
router.use('/Company', companyRoutes)
router.use('/Enterprise', enterpriseRoutes)
router.use('/User', userRoutes)
router.use('/Backup', backupRoutes)
router.use('/Vpn', vpnRoutes)
router.use('/Navigation', navigationRoutes)
router.use('/Storage', storageRoutes)

export default router
