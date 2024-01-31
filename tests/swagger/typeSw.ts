import type {ModelAttributeColumnOptions, Model} from 'sequelize'

type Attribute = ModelAttributeColumnOptions<Model<any, any>>

const getLength = (typeSq: string): number => {
  const length = Number(typeSq.replace(/\D/gi, ''))
  if (Number.isNaN(length)) return 0
  return length
}

export const getTypeExp = (atribute: Attribute) => {
  const columType = atribute.type.toString({})
  if (columType === 'TINYINT(1)') return 'boolean'
  if (columType.includes('VARCHAR')) return 'string'
  if (columType.includes('CHAR')) return 'string'
  if (columType.includes('TEXT')) return 'string'
  if (columType.includes('JSON')) return 'string'
  if (columType.includes('DATETIME')) return 'string'
  if (columType.includes('DATEONLY')) return 'string'
  if (columType.includes('DATE')) return 'string'
  if (columType.includes('TIME')) return 'string'
  if (columType.includes('INTEGER')) return 'number'
  if (columType.includes('NUMBER')) return 'number'
  console.log(atribute.field, columType)
  return ''
}

export const getTypeExp2 = (attribute: Attribute) => {
  const columType = attribute.type.toString({})
  if (columType === 'TINYINT(1)')
    return {
      type: 'boolean',
      example: attribute.defaultValue ?? !attribute.allowNull
    }
  if (columType.includes('VARCHAR'))
    return {
      type: 'string',
      example: attribute.defaultValue ?? !attribute.allowNull
    }
  if (columType.includes('CHAR')) return 'string'
  if (columType.includes('TEXT')) return 'string'
  if (columType.includes('JSON')) return 'string'
  if (columType.includes('DATETIME')) return 'string'
  if (columType.includes('DATEONLY')) return 'string'
  if (columType.includes('DATE')) return 'string'
  if (columType.includes('TIME')) return 'string'
  if (columType.includes('INTEGER')) return 'number'
  if (columType.includes('NUMBER')) return 'number'
  console.log(attribute.field, columType)
  return ''
}

const getTypeOf = (atribute: Attribute): [string, number] => {
  const typeSq = atribute.type.toString({})
  if (typeSq === 'TINYINT(1)') return ['boolean', 1]
  if (typeSq.includes('VARCHAR')) return ['string', getLength(typeSq)]
  if (typeSq.includes('CHAR')) return ['string', getLength(typeSq)]
  if (typeSq.includes('TEXT')) return ['string', getLength(typeSq)]
  if (typeSq.includes('DATETIME')) return ['string', 25]
  if (typeSq.includes('DATEONLY')) return ['string', 10]
  if (typeSq.includes('DATE')) return ['string', 10]
  if (typeSq.includes('TIME')) return ['string', 8]
  if (typeSq.includes('INTEGER')) return ['number', getLength(typeSq) ?? 1]
  if (typeSq.includes('NUMBER')) return ['number', getLength(typeSq) ?? 1]
  console.log(atribute.field, typeSq)
  return ['', 0]
}
