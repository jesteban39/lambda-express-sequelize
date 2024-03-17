import crypto from 'crypto'
import type {ModelAttributeColumnOptions} from 'sequelize'

const toSpaceCase = (s: string) => s.replace(/_/g, ' ')

const getlength = (stringT: string) => {
  const num = Number(stringT.replace(/\D/gi, ''))
  if (Number.isNaN(num)) return 1
  return num
}

export const mekeAtribut = (colum: ModelAttributeColumnOptions, tableName: string) => {
  const strType = colum.type.toString({})

  if (/(VARCHAR)|(TEXT)|(CHAR)/i.test(strType)) {
    if (colum.primaryKey) return crypto.randomUUID()
    if (colum.defaultValue) return colum.defaultValue
    const expColum = `${toSpaceCase(tableName)} ${toSpaceCase(colum.field ?? '')}`
    return expColum.slice(0, getlength(strType))
  }

  if (colum.defaultValue) return colum.defaultValue

  if (strType === 'TINYINT(1)') return true

  if (/(INTEGER)|(NUMBER)/i.test(strType)) return crypto.randomInt(1024)

  if (strType.includes('DATE')) return new Date(Date.now()).toJSON().split('T')[0]
  // if (strType.includes('TIME')) return ['string', 8]
  // if (strType.includes('DATETIME')) return ['string', 25]
  console.log(colum.field, strType)
  throw new Error(`Type "${strType}" not supported`)
}
