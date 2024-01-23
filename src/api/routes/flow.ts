import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Flow} = getModels()
  const flows = await Flow.findAll()
  return res.status(statusCodes.OK).json(flows)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Flow} = getModels()
  const {uuid} = req.params
  const flow = await Flow.findByPk(uuid)
  if (!flow) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(flow)
})

router.post('/', async (req: Request, res: Response) => {
  const {Flow} = getModels()
  const flow = await Flow.create(req.body)
  return res.status(statusCodes.OK).json(flow)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Flow} = getModels()
  const {uuid} = req.params
  const flow = await Flow.findByPk(uuid)
  if (!flow) throw new PkNotMache(uuid)
  const newFlow = await flow.update({...req.body})
  return res.status(statusCodes.OK).json(newFlow)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Flow} = getModels()
  const {uuid} = req.params
  const flow = await Flow.findByPk(parseInt(uuid))
  if (!flow) throw new PkNotMache(uuid)
  const newFlow = await flow.destroy()
  return res.status(statusCodes.OK).json(newFlow)
})

export default router
