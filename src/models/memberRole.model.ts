import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Member from './member.model';
import Role from './role.model';
import { MemberRoleAttributes } from '../types';

class MemberRole extends Model<MemberRoleAttributes> implements MemberRoleAttributes {
  public memberId!: number;
  public roleId!: number;
}

MemberRole.init(
  {
    memberId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Member,
        key: 'id',
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Role,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'member_roles',
    timestamps: false,
  }
);

export default MemberRole;
