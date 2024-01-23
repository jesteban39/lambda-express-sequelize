import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Contact} = getModels()
  const contacts = await Contact.findAll()
  return res.status(statusCodes.OK).json(contacts)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Contact} = getModels()
  const {uuid} = req.params
  const contact = await Contact.findByPk(uuid)
  if (!contact) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(contact)
})

router.post('/', async (req: Request, res: Response) => {
  const {Contact} = getModels()
  const contact = await Contact.create(req.body)
  return res.status(statusCodes.OK).json(contact)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Contact} = getModels()
  const {uuid} = req.params
  const contact = await Contact.findByPk(uuid)
  if (!contact) throw new PkNotMache(uuid)
  const newContact = await contact.update({...req.body})
  return res.status(statusCodes.OK).json(newContact)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Contact} = getModels()
  const {uuid} = req.params
  const contact = await Contact.findByPk(parseInt(uuid))
  if (!contact) throw new PkNotMache(uuid)
  const newContact = await contact.destroy()
  return res.status(statusCodes.OK).json(newContact)
})

export default router
