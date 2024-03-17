import {NodeEnvs} from '@src/declarations/enums'
import env from 'dotenv'
import path from 'path'

const nodeEnv = process.env.NODE_ENV ?? NodeEnvs.prd

env.config({
  path: path.resolve(process.cwd(), nodeEnv === NodeEnvs.prd ? '.env' : `.env.${nodeEnv}`)
})

export default {
  nodeEnv: process.env.NODE_ENV ?? nodeEnv,
  host: process.env.DOMAIN ?? '',
  port: Number(process.env.PORT ?? 0),
  dbName: process.env.DB_NAME ?? '',
  dbUser: process.env.DB_USER ?? '',
  dbHost: process.env.DB_HOST ?? '',
  dbPass: process.env.DB_PASSWORD ?? '',
  dbSsl: process.env.DB_SSL ?? null,
  dbport: Number(process.env.DB_PORT ?? 0)
} as const
