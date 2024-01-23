import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Storage} = getModels()
  const storage = await Storage.findAll()
  return res.status(statusCodes.OK).json(storage)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Storage} = getModels()
  const {uuid} = req.params
  const storage = await Storage.findByPk(uuid)
  if (!storage) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(storage)
})

router.post('/', async (req: Request, res: Response) => {
  const {Storage} = getModels()
  const storage = await Storage.create(req.body)
  return res.status(statusCodes.OK).json(storage)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Storage} = getModels()
  const {uuid} = req.params
  const storage = await Storage.findByPk(uuid)
  if (!storage) throw new PkNotMache(uuid)
  const newStorage = await storage.update({...req.body})
  return res.status(statusCodes.OK).json(newStorage)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Storage} = getModels()
  const {uuid} = req.params
  const storage = await Storage.findByPk(parseInt(uuid))
  if (!storage) throw new PkNotMache(uuid)
  const newStorage = await storage.destroy()
  return res.status(statusCodes.OK).json(newStorage)
})

export default router
