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
  public username!: string;
  public email!: string;
  public phone!: string;
  public profilePicture!: string;
  public password!: string;
  public isActive!: boolean;
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
        len: {
          args: [3, 50],
          msg: 'Name should be between 3 and 50 characters',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Username must not be empty',
        },
        len: {
          args: [3, 30],
          msg: 'Username should be between 3 and 30 characters',
        },
        is: {
          args: /^[a-zA-Z0-9_.-]*$/i,
          msg: 'Username can only contain letters, numbers, underscores, dots, and hyphens',
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
        notEmpty: {
          msg: 'Email must not be empty',
        },
        len: {
          args: [5, 100],
          msg: 'Email should be between 5 and 100 characters',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone number must not be empty',
        },
        is: {
          args: /^[0-9+\-() ]+$/i,
          msg: 'Phone number can only contain numbers, spaces, and symbols (+, -, (, ))',
        },
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Profile picture must be a valid URL',
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
        len: {
          args: [8, 100],
          msg: 'Password should have at least 8 characters',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'members',
    timestamps: true,
  }
);


export default Member;
