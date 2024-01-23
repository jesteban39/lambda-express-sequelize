import type {Request, Response} from 'express'

export type User = {
  uuid: string
  nombre: string
}

export interface ReqUser extends Request {
  body: User
}

export interface ResUser extends Response {}
