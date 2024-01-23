import type {ModelAttributeColumnOptions, ModelStatic, Model} from 'sequelize'

const getTypeOf = (
  atribute: ModelAttributeColumnOptions<Model<any, any>>
): [string, number] => {
  const stringType = atribute.type.toString({})
  const getlength = (stringT: string): number | null => {
    const num = Number(stringT.replace(/[\D]/gi, ''))
    if (Number.isNaN(num)) return null
    return num
  }
  if (stringType === 'TINYINT(1)') return ['boolean', 1]
  if (stringType.includes('VARCHAR')) return ['string', getlength(stringType) || -1]
  if (stringType.includes('CHAR')) return ['string', getlength(stringType) || -1]
  if (stringType.includes('TEXT')) return ['string', 0]
  if (stringType.includes('DATE')) return ['string', 10]
  if (stringType.includes('TIME')) return ['string', 8]
  if (stringType.includes('DATETIME')) return ['string', 25]
  if (stringType.includes('INTEGER')) return ['number', getlength(stringType) || 1]
  if (stringType.includes('NUMBER')) return ['number', getlength(stringType) || 1]
  console.log(atribute.field, stringType)
  return ['', -1]
}

const mekeProperties = (Model: ModelStatic<Model<any, any>>) => {
  const atributes = Model.getAttributes()

  return Object.keys(atributes).reduce((properties: any, key: string) => {
    const atribute = atributes[key]
    properties[key] = {
      type: getTypeOf(atribute)[0],
      required: atribute.allowNull !== true,
      description:
        atribute.comment || `${Model.tableName} ${atribute.field?.replace(/_/g, ' ')}`,
      example: '3973'
    }
    return properties
  }, {})
}

export const mekeDefinitions = (Models: {
  [key: string]: ModelStatic<Model<any, any>>
}) => {
  return Object.values(Models).reduce((definitions: any, Model) => {
    definitions[Model.name] = {
      type: 'object',
      properties: mekeProperties(Model)
    }
    return definitions
  }, {})
}

export default mekeDefinitions
