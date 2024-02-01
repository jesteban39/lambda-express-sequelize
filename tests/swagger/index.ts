import yaml from 'js-yaml'
import fs from 'fs'
import crypto from 'crypto'
import {mekeSchema} from './mekeSchema'
import type {ModelStatic, Model} from 'sequelize'
import type {LambdaConfog, LambdaResult} from '../types'

export type Models = {[key: string]: ModelStatic<Model<any, any>>}

export interface Parameters {
  name: string
  in: string
  type: string
  required: boolean
}


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
}

const mekeExample = (model: ModelStatic<Model<any, any>>) => {
  const attributes = Object.entries(model.getAttributes())
  return attributes.reduce((exp: any, [key, attribute]) => {
    if (attribute.primaryKey) {
      exp[key] = crypto.randomUUID()
    } else if (attribute.defaultValue) exp[key] = attribute.defaultValue
    else exp[key] = `${model.tableName} ${attribute.field?.replace(/_/g, ' ')}`
    return exp
  }, {})
}

const getExample = (model: ModelStatic<Model<any, any>>, exp: any) => {
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



export const addModels = (models: ModelStatic<Model<any, any>>[], exps: any) => {
  models.forEach((model) => {
    swaggerObject.components.schemas[model.tableName] = mekeSchema(model)
    swaggerObject.components.tags.push(model.name)
    exp[model.name] = getExample(model, exps)
  })
  return exp
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
