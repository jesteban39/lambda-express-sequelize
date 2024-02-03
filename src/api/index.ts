import {Router} from 'express'
import crudRoutes from './crud'
// import clientRoutes from './routes/client'
// import userRoutes from './routes/user'

export const router = Router()

// router.use('/Client', clientRoutes)
// router.use('/User', userRoutes)

router.use('/', crudRoutes)

export default router
