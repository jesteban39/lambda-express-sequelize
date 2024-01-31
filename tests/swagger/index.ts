import yaml from 'js-yaml'
import fs from 'fs'
import crypto from 'crypto'
import {mekeSchema} from './mekeSchema'
import {getTypeExp} from './typeSw'
import examples from '../examples.json'
import type {ModelStatic, Model} from 'sequelize'
import type {LambdaConfog, LambdaResult} from '../types'

export type Models = {[key: string]: ModelStatic<Model<any, any>>}

let exp: any = {}

let swaggerObject: any = {
  openapi: '3.0.0',
  info: {
    title: 'lambda-express-sequelize',
    description: 'documentación lambda-express-sequelize',
    version: '1.0.0',
    servers: [`http://localhost:4000`]
  },
  paths: {},
  components: {
    parameters: {},
    definitions: {},
    schemas: {},
    tags: []
  }
}

export const saveSwagger = () => {
  fs.writeFileSync('./swagger.json', JSON.stringify(swaggerObject), 'utf8')
  fs.writeFileSync('./swagger.yml', yaml.dump(swaggerObject), 'utf8')
  //fs.writeFileSync('../examples.json', JSON.stringify(exp), 'utf8')
}

const mekeExample = (model: ModelStatic<Model<any, any>>) => {
  const attributes = Object.entries(model.getAttributes())
  return attributes.reduce((exp: any, [key, attribute]) => {
    const typeS = getTypeExp(attribute)
    let value
    if (attribute.primaryKey) value = crypto.randomUUID()
    else if (attribute.defaultValue) value = attribute.defaultValue
    else value = `${model.tableName} ${attribute.field?.replace(/_/g, ' ')}`
    
    exp[key] = value
    const r = {
      type: typeS,
      required: attribute.allowNull !== true,
      description:
        attribute.comment ?? `${model.tableName} ${attribute.field?.replace(/_/g, ' ')}`,
      example: '3973'
    }
    return exp
  }, {})
}

const mekeExamples = (exp: any, model: ModelStatic<Model<any, any>>) => {
  if (!exp[model.name]) exp[model.name] = {}
  if (!exp[model.name].list) exp[model.name].list = []
  if (!exp[model.name].list[0]) exp[model.name].list[0] = mekeExample(model)
  if (!exp[model.name].list[1]) exp[model.name].list[1] = mekeExample(model)
  if (!exp[model.name].list[2]) exp[model.name].list[2] = mekeExample(model)
  if (!exp[model.name].new) exp[model.name].new = mekeExample(model)
  if (!exp[model.name].edit)
    exp[model.name].edit = {
      ...mekeExample(model),
      uuid: exp[model.name].list[0].uuid
    }
  return exp
}

export const addModel = (model: ModelStatic<Model<any, any>>) => {
  swaggerObject.components.schemas[model.tableName] = mekeSchema(model)
  swaggerObject.components.tags.push(model.name)
  return mekeExamples(examples, model)
}

export interface Parameters {
  name: string
  in: string
  type: string
  required: boolean
}

export const addRoute = (action: LambdaConfog, res: LambdaResult) => {
  const {url, parameters} = getParameters(action)

  if (!swaggerObject.paths[url]) {
    swaggerObject.paths[url] = {}
  }

  swaggerObject.paths[url][action.method.toLowerCase()] = {
    tags: [action.modelName],
    parameters,
    requestBody: action.body
      ? {
          required: true,
          content: mekeContent(res.data)
        }
      : null,
    responses: {}
  }
  swaggerObject.paths[url][action.method.toLowerCase()].responses[res.statusCode] = {
    content: mekeContent(res.data)
  }
}

const mekeContent = (data: any) => {
  return {
    'application/json': {
      schema: {
        type: Array.isArray(data) ? 'array' : typeof data,
        example: data
      }
    }
  }
}

const getParameters = (action: LambdaConfog) => {
  const [baseUrl, params] = Object.entries(action.params).reduce(
    ([path, parameters], [key, value]) => {
      path = path.replace(`:${key}`, `{${key}}`)
      parameters.push({
        name: key,
        in: 'path',
        type: typeof value,
        required: true
      })
      return [path, parameters]
    },
    [action.path, [] as Parameters[]]
  )

  const [url, parameters] = Object.entries(action.querys).reduce(
    ([path, parameters], [key, value]) => {
      path += `${!path.includes('?') ? '?' : '&'}${key}={${key}}`
      parameters.push({
        name: key,
        in: 'path',
        type: typeof value,
        required: false
      })
      return [path, parameters]
    },
    [baseUrl, params]
  )

  return {url, parameters}
}
