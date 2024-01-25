import {Router} from 'express'
import {PkNotMache} from '@declarations/errors'
import {getModels} from '@db'
import statusCodes from '@config/statusCodes'
import type {Request, Response} from 'express'
import {Op} from 'sequelize'

export const router = Router()

router.get('/:modelName/', async (req: Request, res: Response): Promise<any> => {
  const {modelName} = req.params
  const Model = getModels()[modelName]
  const result = await Model.findAll()
  return res.status(statusCodes.OK).json(result)
})

router.get('/:modelName/filter', async (req: Request, res: Response) => {
  const {modelName} = req.params
  const Model = getModels()[modelName]
  const colums = Object.keys(Model.getAttributes())
  const cuerys = colums.reduce((acc, key) => {
    if (req.query[key]) {
      if (key === 'uuid') acc.push({[key]: req.query[key]})
      else acc.push({[key]: {[Op.like]: `%${req.query[key]}%`}})
    }
    return acc
  }, [] as any)
  const result = await Model.findAll({
    where: cuerys.length > 0 ? {[Op.and]: cuerys} : {}
  })
  return res.status(statusCodes.OK).json(result)
})

router.get('/:modelName/:uuid', async (req: Request, res: Response) => {
  const {uuid, modelName} = req.params
  const Model = getModels()[modelName]
  const result = await Model.findByPk(uuid)
  if (!result) throw new PkNotMache(uuid)
  return res.status(statusCodes.OK).json(result)
})

router.post('/:modelName/', async (req: Request, res: Response) => {
  const {modelName} = req.params
  const Model = getModels()[modelName]
  const result = await Model.create(req.body)
  return res.status(statusCodes.OK).json(result)
})

router.put('/:modelName/:uuid', async (req: Request, res: Response) => {
  const {uuid, modelName} = req.params
  const Model = getModels()[modelName]
  const model = await Model.findByPk(uuid)
  if (!model) throw new PkNotMache(uuid)
  const newModel = await model.update({...req.body})
  return res.status(statusCodes.OK).json(newModel)
})

router.delete('/:modelName/:uuid', async (req: Request, res: Response) => {
  const {uuid, modelName} = req.params
  const Model = getModels()[modelName]
  const model = await Model.findByPk(parseInt(uuid))
  if (!model) throw new PkNotMache(uuid)
  const newModel = await model.destroy()
  return res.status(statusCodes.OK).json(newModel)
})

export default router
