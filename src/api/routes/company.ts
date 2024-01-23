import {Router} from 'express'
import type {Request, Response} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'

export const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const {Company} = getModels()
  const companies = await Company.findAll()
  return res.status(statusCodes.OK).json(companies)
})

router.get('/:uuid', async (req: Request, res: Response) => {
  const {Company} = getModels()
  const {uuid} = req.params
  const company = await Company.findByPk(uuid)
  if (!company) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(company)
})

router.post('/', async (req: Request, res: Response) => {
  const {Company} = getModels()
  const company = await Company.create(req.body)
  return res.status(statusCodes.OK).json(company)
})

router.put('/:uuid', async (req: Request, res: Response) => {
  const {Company} = getModels()
  const {uuid} = req.params
  const company = await Company.findByPk(uuid)
  if (!company) throw new PkNotMache(uuid)
  const newCompany = await company.update({...req.body})
  return res.status(statusCodes.OK).json(newCompany)
})

router.delete('/:uuid', async (req: Request, res: Response) => {
  const {Company} = getModels()
  const {uuid} = req.params
  const company = await Company.findByPk(parseInt(uuid))
  if (!company) throw new PkNotMache(uuid)
  const newCompany = await company.destroy()
  return res.status(statusCodes.OK).json(newCompany)
})

export default router
