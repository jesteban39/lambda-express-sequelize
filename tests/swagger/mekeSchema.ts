import type {ModelAttributeColumnOptions, ModelStatic, Model} from 'sequelize'

const getlength = (stringT: string): number | null => {
  const num = Number(stringT.replace(/\D/gi, ''))
  if (Number.isNaN(num)) return null
  return num
}

const getTypeOf = (
  atribute: ModelAttributeColumnOptions<Model<any, any>>
): [string, number] => {
  const stringType = atribute.type.toString({})
  if (stringType === 'TINYINT(1)') return ['boolean', 1]
  if (stringType.includes('VARCHAR')) return ['string', getlength(stringType) ?? 0]
  if (stringType.includes('CHAR')) return ['string', getlength(stringType) ?? 0]
  if (stringType.includes('TEXT')) return ['string', getlength(stringType) ?? 0]
  if (stringType.includes('DATE')) return ['string', 10]
  if (stringType.includes('TIME')) return ['string', 8]
  if (stringType.includes('DATETIME')) return ['string', 25]
  if (stringType.includes('INTEGER')) return ['number', getlength(stringType) ?? 1]
  if (stringType.includes('NUMBER')) return ['number', getlength(stringType) ?? 1]
  console.log(atribute.field, stringType)
  return ['', 0]
}

export const mekeSchema = (model: ModelStatic<Model<any, any>>) => {
  return {
    type: 'object',
    properties: Object.entries(model.getAttributes()).reduce(
      (properties: any, [key, atribute]) => {
        properties[key] = {
          type: getTypeOf(atribute)[0],
          required: atribute.allowNull !== true,
          description:
            atribute.comment ??
            `${model.tableName} ${atribute.field?.replace(/_/g, ' ')}`,
          example: '3973'
        }
        return properties
      },
      {}
    )
  }
}
