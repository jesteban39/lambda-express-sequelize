import {Sequelize} from 'sequelize'
import {defineModels} from './defineModels'
import envVars from '@config/envVars'
import {relations} from './relations'

// de tipo any para poder eliminar getConnection
let sequelize = <Sequelize | any>null

const defineSequelize = () => {
  sequelize = new Sequelize(envVars.dbName, envVars.dbUser, envVars.dbPass, {
    host: envVars.dbHost,
    dialect: 'mysql',
    dialectOptions: {
      ssl: envVars.dbSsl
    },
    pool: {
      min: 0,
      max: 9,
      idle: 0,
      acquire: 9000,
      evict: 9000
    },
    port: envVars.dbport,
    logging: false,
    define: {
      freezeTableName: true,
      underscored: true,
      timestamps: false
    }
  })
  defineModels(sequelize)
  relations(sequelize)
}

export const open = async (): Promise<Sequelize> => {
  if (sequelize) {
    sequelize.connectionManager.initPools()
    if (sequelize.connectionManager.hasOwnProperty('getConnection')) {
      delete sequelize.connectionManager['getConnection']
    }
  }
  defineSequelize()
  await sequelize.authenticate()
  await sequelize.sync({force: true})
  return sequelize
}

export const close = async () => {
  try {
    if (!sequelize) return
    await sequelize.connectionManager.close()
  } catch (error) {
    console.error(error)
  }
}

export const getModels = () => {
  if (!sequelize) throw new Error('NO se ha creado Sequelize')
  if (!(sequelize instanceof Sequelize))
    throw new Error('sequelize NO es de tipo Sequelize')
  return sequelize.models
}

export default {open, close, getModels}
