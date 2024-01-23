import type {ModelStatic, Model} from 'sequelize'

export type LambdaConfog = {
  method: string
  path: string
  modelName: string
  params: {[key: string]: string}
  cerys: {[key: string]: string}
  headers: {[header: string]: string}
  body: any
}

export type LambdaResult = {
  headers: {[header: string]: string | number | boolean} | undefined
  statusCode: number
  body: any
}

export type Modeln = ModelStatic<Model<any, any>>

export type Models = {[key: string]: Modeln}
