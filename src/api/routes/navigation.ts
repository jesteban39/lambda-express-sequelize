import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Navigation} = getModels()
  const navigations = await Navigation.findAll()
  return res.status(statusCodes.OK).json(navigations)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Navigation} = getModels()
  const {uuid} = req.params
  const navigation = await Navigation.findByPk(uuid)
  if (!navigation) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(navigation)
})

router.post('/', async (req: Request, res: Response) => {
  const {Navigation} = getModels()
  const navigation = await Navigation.create(req.body)
  return res.status(statusCodes.OK).json(navigation)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Navigation} = getModels()
  const {uuid} = req.params
  const navigation = await Navigation.findByPk(uuid)
  if (!navigation) throw new PkNotMache(uuid)
  const newNavigation = await navigation.update({...req.body})
  return res.status(statusCodes.OK).json(newNavigation)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Navigation} = getModels()
  const {uuid} = req.params
  const navigation = await Navigation.findByPk(parseInt(uuid))
  if (!navigation) throw new PkNotMache(uuid)
  const newNavigation = await navigation.destroy()
  return res.status(statusCodes.OK).json(newNavigation)
})

export default router
