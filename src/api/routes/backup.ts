import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Backup} = getModels()
  const backups = await Backup.findAll()
  return res.status(statusCodes.OK).json(backups)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Backup} = getModels()
  const {uuid} = req.params
  const backup = await Backup.findByPk(uuid)
  if (!backup) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(backup)
})

router.post('/', async (req: Request, res: Response) => {
  const {Backup} = getModels()
  const backup = await Backup.create(req.body)
  return res.status(statusCodes.OK).json(backup)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Backup} = getModels()
  const {uuid} = req.params
  const backup = await Backup.findByPk(uuid)
  if (!backup) throw new PkNotMache(uuid)
  const newBackup = await backup.update({...req.body})
  return res.status(statusCodes.OK).json(newBackup)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Backup} = getModels()
  const {uuid} = req.params
  const backup = await Backup.findByPk(parseInt(uuid))
  if (!backup) throw new PkNotMache(uuid)
  const newBackup = await backup.destroy()
  return res.status(statusCodes.OK).json(newBackup)
})

export default router
