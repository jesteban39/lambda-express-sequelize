import {ModelStatic, Model} from 'sequelize'
import type {LambdaConfog as Action} from '../types'

export const meakeRoutes = (
  Models: {[key: string]: ModelStatic<Model<any, any>>},
  actions: {[name: string]: Action}
) => {
  return Object.values(Models).reduce((routes: any, Model) => {
    Object.values(actions).forEach((action) => {
      routes[`/api/${Model.name}${action.path}`] = {
        [action.method.toLowerCase()]: {
          // tags: [Model.name],
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
                          $ref: `#/components/schemas/${Model.name}`
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
    })

    return routes
  }, {})
}

export default meakeRoutes
