import type {Sequelize, Model} from 'sequelize'
import user from './models/user'
import client from './models/client'

interface TUser {
  uuid: string
  nombre: string
}

export const defineModels = (sequelize: Sequelize) => {
  const User = sequelize.define<Model<TUser, TUser>>('User', user, {tableName: 'usuario'})
  sequelize.define('Client', client, {tableName: 'cliente'})
}
