import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Service} = getModels()
  const services = await Service.findAll()
  return res.status(statusCodes.OK).json(services)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Service} = getModels()
  const {uuid} = req.params
  const service = await Service.findByPk(uuid)
  if (!service) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(service)
})

router.post('/', async (req: Request, res: Response) => {
  const {Service} = getModels()
  const service = await Service.create(req.body)
  return res.status(statusCodes.OK).json(service)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Service} = getModels()
  const {uuid} = req.params
  const service = await Service.findByPk(uuid)
  if (!service) throw new PkNotMache(uuid)
  const newService = await service.update({...req.body})
  return res.status(statusCodes.OK).json(newService)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Service} = getModels()
  const {uuid} = req.params
  const service = await Service.findByPk(parseInt(uuid))
  if (!service) throw new PkNotMache(uuid)
  const newService = await service.destroy()
  return res.status(statusCodes.OK).json(newService)
})

export default router
