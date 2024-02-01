import yaml from 'js-yaml'
import fs from 'fs'
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

export const addModels = (models: ModelStatic<Model<any, any>>[], examples: any) => {
  return models.forEach((model) => {
    const schema = mekeSchema(model, examples[model.name].new)
    swaggerObject.components.schemas[model.tableName] = schema
    swaggerObject.components.tags.push(model.name)
  })
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
