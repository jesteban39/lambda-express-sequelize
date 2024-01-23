import type {LambdaConfog as Action} from '../types'

export const meakeRoute = (action: Action) => {
  return {
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
