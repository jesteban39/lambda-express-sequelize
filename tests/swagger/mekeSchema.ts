import type {ModelStatic, Model} from 'sequelize'

export const mekeSchema = (model: ModelStatic<Model>, example: any) => {
  return {
    type: 'object',
    properties: Object.entries(model.getAttributes()).reduce(
      (properties: any, [key, atribute]) => {
        properties[key] = {
          type: typeof example[key],
          required: atribute.allowNull !== true,
          description:
            atribute.comment ??
            `${model.tableName} ${atribute.field?.replace(/_/g, ' ')}`,
          example: example[key]
        }
        return properties
      },
      {}
    )
  }
}
