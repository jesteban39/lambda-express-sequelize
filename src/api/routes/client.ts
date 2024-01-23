import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Client} = getModels()
  const clients = await Client.findAll()
  return res.status(statusCodes.OK).json(clients)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Client} = getModels()
  const {uuid} = req.params
  const client = await Client.findByPk(uuid)
  if (!client) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(client)
})

router.post('/', async (req: Request, res: Response) => {
  const {Client} = getModels()
  const client = await Client.create(req.body)
  return res.status(statusCodes.OK).json(client)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Client} = getModels()
  const {uuid} = req.params
  const client = await Client.findByPk(uuid)
  if (!client) throw new PkNotMache(uuid)
  const newClient = await client.update({...req.body})
  return res.status(statusCodes.OK).json(newClient)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Client} = getModels()
  const {uuid} = req.params
  const client = await Client.findByPk(parseInt(uuid))
  if (!client) throw new PkNotMache(uuid)
  const newClient = await client.destroy()
  return res.status(statusCodes.OK).json(newClient)
})

export default router
