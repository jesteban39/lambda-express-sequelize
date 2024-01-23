import yaml from 'js-yaml'
import fs from 'fs'
import {mekeSchemas} from './mekeSchemas'
import {mekeSchema} from './mekeSchema'
import type {ModelStatic, Model} from 'sequelize'
import type {LambdaConfog as Action} from '../types'

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

const addSchemas = (md: Models) => {
  models = md
  swaggerObject.components.schemas = mekeSchemas(md)
  //swaggerObject.components.definitions = mekeSchemas(md)
  swaggerObject.components.tags = Object.keys(md).map((key) => ({
    name: key,
    description: null
  }))
}

export const addModel = (model: ModelStatic<Model<any, any>>) => {
  models[model.name] = model
  swaggerObject.components.schemas[model.name] = mekeSchema(model)
  //swaggerObject.components.definitions[model.name] = mekeSchema(model)
  swaggerObject.components.tags = Object.keys(model).map((key) => ({
    name: key,
    description: null
  }))
}

export const addRoute = (action: Action) => {
  if (!swaggerObject.paths[action.path]) {
    swaggerObject.paths[action.path] = {}
  }
  swaggerObject.paths[action.path][action.method.toLowerCase()] = {
    tags: [action.modelName],
    summary: null,
    description: null,
    responses: {
      '200': {
        description: null,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                allOf: [
                  {
                    $ref: `#/components/schemas/${action.modelName}`
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
}
