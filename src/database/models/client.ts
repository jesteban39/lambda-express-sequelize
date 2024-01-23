import {DataTypes} from 'sequelize'

export default {
  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    primaryKey: true,
    comment: 'identificador universal unico para la tabal cliente'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'nombre del clinete'
  }
}
