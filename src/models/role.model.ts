import {
  DataTypes,
  Model,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import sequelize from '../config/db';
import Member from './member.model';

class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addMember!: BelongsToManyAddAssociationMixin<Member, number>;
  public removeMember!: BelongsToManyRemoveAssociationMixin<Member, number>;
  public getMembers!: BelongsToManyGetAssociationsMixin<Member>;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No description',
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true,
  }
);

export default Role;
