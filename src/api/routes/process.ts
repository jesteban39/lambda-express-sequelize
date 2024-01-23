import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Process} = getModels()
  const processes = await Process.findAll()
  return res.status(statusCodes.OK).json(processes)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Process} = getModels()
  const {uuid} = req.params
  const process = await Process.findByPk(uuid)
  if (!process) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(process)
})

router.post('/', async (req: Request, res: Response) => {
  const {Process} = getModels()
  const process = await Process.create(req.body)
  return res.status(statusCodes.OK).json(process)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Process} = getModels()
  const {uuid} = req.params
  const process = await Process.findByPk(uuid)
  if (!process) throw new PkNotMache(uuid)
  const newProcess = await process.update({...req.body})
  return res.status(statusCodes.OK).json(newProcess)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Process} = getModels()
  const {uuid} = req.params
  const process = await Process.findByPk(parseInt(uuid))
  if (!process) throw new PkNotMache(uuid)
  const newProcess = await process.destroy()
  return res.status(statusCodes.OK).json(newProcess)
})

export default router
