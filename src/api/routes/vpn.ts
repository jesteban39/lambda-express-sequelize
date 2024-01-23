import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Vpn} = getModels()
  const vpns = await Vpn.findAll()
  return res.status(statusCodes.OK).json(vpns)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Vpn} = getModels()
  const {uuid} = req.params
  const vpn = await Vpn.findByPk(uuid)
  if (!vpn) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(vpn)
})

router.post('/', async (req: Request, res: Response) => {
  const {Vpn} = getModels()
  const vpn = await Vpn.create(req.body)
  return res.status(statusCodes.OK).json(vpn)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Vpn} = getModels()
  const {uuid} = req.params
  const vpn = await Vpn.findByPk(uuid)
  if (!vpn) throw new PkNotMache(uuid)
  const newVpn = await vpn.update({...req.body})
  return res.status(statusCodes.OK).json(newVpn)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Vpn} = getModels()
  const {uuid} = req.params
  const vpn = await Vpn.findByPk(parseInt(uuid))
  if (!vpn) throw new PkNotMache(uuid)
  const newVpn = await vpn.destroy()
  return res.status(statusCodes.OK).json(newVpn)
})

export default router
