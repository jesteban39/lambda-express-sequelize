import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Enterprise} = getModels()
  const enterprises = await Enterprise.findAll()
  return res.status(statusCodes.OK).json(enterprises)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Enterprise} = getModels()
  const {uuid} = req.params
  const enterprise = await Enterprise.findByPk(uuid)
  if (!enterprise) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(enterprise)
})

router.post('/', async (req: Request, res: Response) => {
  const {Enterprise} = getModels()
  const enterprise = await Enterprise.create(req.body)
  return res.status(statusCodes.OK).json(enterprise)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Enterprise} = getModels()
  const {uuid} = req.params
  const enterprise = await Enterprise.findByPk(uuid)
  if (!enterprise) throw new PkNotMache(uuid)
  const newEnterprise = await enterprise.update({...req.body})
  return res.status(statusCodes.OK).json(newEnterprise)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Enterprise} = getModels()
  const {uuid} = req.params
  const enterprise = await Enterprise.findByPk(parseInt(uuid))
  if (!enterprise) throw new PkNotMache(uuid)
  const newEnterprise = await enterprise.destroy()
  return res.status(statusCodes.OK).json(newEnterprise)
})

export default router
