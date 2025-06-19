import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Permission extends Model {
  public id!: number;
  public resource!: string;
  public action!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Resource must not be empty',
        },
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Action must not be empty',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    timestamps: true,
  }
);

export default Permission;
