import yaml from 'js-yaml'
import fs from 'fs'
import {mekeSchema} from './mekeSchema'
import type {ModelStatic, Model} from 'sequelize'
import type {LambdaConfog, LambdaResult} from '../types'

export type Models = {[key: string]: ModelStatic<Model<any, any>>}

let models = <Models>{}

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
  fs.writeFileSync('./swagger.yml', yaml.dump(swaggerObject), 'utf8')
  fs.writeFileSync('./swagger.json', JSON.stringify(swaggerObject), 'utf8')
}

export const addModel = (model: ModelStatic<Model<any, any>>) => {
  models[model.name] = model
  swaggerObject.components.schemas[model.name] = mekeSchema(model)
  //swaggerObject.components.definitions[model.name] = mekeSchema(model)
  swaggerObject.components.tags.push(model.name)
}

export interface Parameters {
  name: string
  in: string
  type: string
  required: boolean
}

export const addRoute = (action: LambdaConfog, res: LambdaResult) => {
  const [baseUrl, parameters] = Object.entries(action.params).reduce(
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

  if (!swaggerObject.paths[baseUrl]) {
    swaggerObject.paths[baseUrl] = {}
  }

  swaggerObject.paths[baseUrl][action.method.toLowerCase()] = {
    tags: [action.modelName],
    parameters,
    requestBody: Boolean(action.body)
      ? {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {},
                example: action.body
              }
            }
          }
        }
      : null,
    responses: {}
  }
  swaggerObject.paths[baseUrl][action.method.toLowerCase()].responses[res.statusCode] = {
    content: {
      'application/json': {
        schema: mekeData(res.data)
      }
    }
  }
}

const mekeData = (data: any) => {
  const type = Array.isArray(data) ? 'array' : typeof data

  return {
    type: type,
    example: data
  }
}
