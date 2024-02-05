import fs from 'fs'
import crypto from 'crypto'
import examples from './examples.json'
import type {Model} from '../types'

const mekeExample = (model: Model) => {
  const attributes = Object.entries(model.getAttributes())
  return attributes.reduce((exp: any, [key, attribute]) => {
    if (attribute.primaryKey) {
      exp[key] = crypto.randomUUID()
    } else if (attribute.defaultValue) exp[key] = attribute.defaultValue
    else exp[key] = `${model.tableName} ${attribute.field?.replace(/_/g, ' ')}`
    return exp
  }, {})
}

const getExample = (model: Model, exp: any) => {
  if (!exp) exp = {}
  if (!exp.list) exp.list = []
  if (!exp.list[0]) exp.list[0] = mekeExample(model)
  if (!exp.list[1]) exp.list[1] = mekeExample(model)
  if (!exp.list[2]) exp.list[2] = mekeExample(model)
  if (!exp.new) exp.new = mekeExample(model)
  if (!exp.edit)
    exp.edit = {
      ...mekeExample(model),
      uuid: exp.list[0].uuid
    }
  return exp
}

export const getExamples = (models: Model[]) => {
  const expls = models.reduce((exps, model) => {
    exps[model.name] = getExample(model, {...exps?.[model.name]})
    return exps
  }, examples as any)
  fs.writeFileSync('./tests/examples/examples.json', JSON.stringify(expls), 'utf8')
  return expls
}
