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
  statusCode: number
  headers: {[header: string]: string | number | boolean}
  body: string
  data: any
}

export type Modeln = ModelStatic<Model<any, any>>

export type Models = {[key: string]: Modeln}
