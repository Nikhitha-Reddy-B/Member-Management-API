import {
  DataTypes,
  Model,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/db';
import Role from './role.model';

class Member extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addRole!: BelongsToManyAddAssociationMixin<Role, number>;
  public removeRole!: BelongsToManyRemoveAssociationMixin<Role, number>;
  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name must not be empty',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password must not be empty',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'members',
    timestamps: true,
  }
);

export default Member;
