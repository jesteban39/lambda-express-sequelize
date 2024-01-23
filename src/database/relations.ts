import type {Sequelize} from 'sequelize'

export const relations = ({models}: Sequelize) => {
  const {User, Client} = models
  //User.belongsTo(Client, {foreignKey: 'usuarioId'})
  //Client.hasMany(User, {foreignKey: 'clineteId'})
}
