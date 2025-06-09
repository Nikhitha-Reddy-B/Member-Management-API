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
  public id!: string;
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Sequelize mixin methods for many-to-many Role association
  public addRole!: BelongsToManyAddAssociationMixin<Role, string>;
  public removeRole!: BelongsToManyRemoveAssociationMixin<Role, string>;
  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
}

Member.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
  },
  {
    sequelize,
    tableName: 'members',
    timestamps: true,
  }
);

export default Member;
