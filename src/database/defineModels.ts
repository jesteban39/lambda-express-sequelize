import type {Sequelize} from 'sequelize'
import user from './models/user'
import client from './models/client'

export const defineModels = (sequelize: Sequelize) => {
  sequelize.define('User', user, {tableName: 'usuario'})
  sequelize.define('Client', client, {tableName: 'cliente'})
}
