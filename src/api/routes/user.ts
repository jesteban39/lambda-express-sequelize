import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {User} = getModels()
  const users = await User.findAll()
  return res.status(statusCodes.OK).json(users)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {User} = getModels()
  const {uuid} = req.params
  const user = await User.findByPk(uuid)
  if (!user) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(user)
})

router.post('/', async (req: Request, res: Response) => {
  const {User} = getModels()
  const user = await User.create(req.body)
  return res.status(statusCodes.OK).json(user)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {User} = getModels()
  const {uuid} = req.params
  const user = await User.findByPk(uuid)
  if (!user) throw new PkNotMache(uuid)
  const newUser = await user.update({...req.body})
  return res.status(statusCodes.OK).json(newUser)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {User} = getModels()
  const {uuid} = req.params
  const user = await User.findByPk(parseInt(uuid))
  if (!user) throw new PkNotMache(uuid)
  const newUser = await user.destroy()
  return res.status(statusCodes.OK).json(newUser)
})

export default router
