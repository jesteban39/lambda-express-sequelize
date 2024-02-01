import type {ModelStatic, Model as Modeln} from 'sequelize'

export type LambdaConfog = {
  method: string
  path: string
  modelName: string
  params: {[key: string]: string}
  querys: {[key: string]: string}
  headers: {[header: string]: string}
  body: any
}

export type LambdaResult = {
  statusCode: number
  headers: {[header: string]: string | number | boolean}
  body: string
  data: any
}

export type Model = ModelStatic<Modeln<any, any>>

export type Models = {[key: string]: Model}
