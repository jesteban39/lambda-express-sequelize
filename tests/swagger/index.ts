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

export const addRoute = (action: LambdaConfog, res: LambdaResult) => {
  if (!swaggerObject.paths[action.path]) {
    swaggerObject.paths[action.path] = {}
  }
  swaggerObject.paths[action.path][action.method.toLowerCase()] = {
    tags: [action.modelName],
    summary: null,
    description: null,
    responses: {}
  }
  swaggerObject.paths[action.path][action.method.toLowerCase()].responses[res.statusCode] = {
    description: null,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {},
          example: {
            data: res.body
          }
        }
      }
    }
  }
}

const mekeData = (body: any) => {
  const type = Array.isArray(body) ? 'array' : typeof body

  if (Array.isArray(body)) {
    return {
      type: 'array',
      items: {},
      example: body
    }
  }

  if (typeof body === 'object') {
    return {
      type: 'object',
      properties: {},
      example: body
    }
  }

  return {
    type: typeof body,
    example: body
  }
}
