import 'express-async-errors'
import express from 'express'
import type {Request, Response, NextFunction} from 'express'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import morgan from 'morgan'
import helmet from 'helmet'
import api from './api'
import envVars from '@config/envVars'
import statusCodes from '@config/statusCodes'
import {NodeEnvs} from '@declarations/enums'
import {RouteError} from '@declarations/errors'
import swaggerJson from '../swagger.json'

const server = express()
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())

if (envVars.nodeEnv === NodeEnvs.dev) {
  server.use(morgan('dev'))
}

if (envVars.nodeEnv === NodeEnvs.prd) {
  server.use(helmet())
}

server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJson))

server.use('/api', api)

server.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(error)
  let status = statusCodes.BAD_REQUEST
  if (error instanceof RouteError) {
    status = error.status
  }
  return res.status(status).json({message: error.message})
})

export default server
