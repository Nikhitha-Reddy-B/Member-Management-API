import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Role from './role.model';
import Permission from './permissions.model';
import { RolePermissionAttributes } from '../types/models';

class RolePermission extends Model<RolePermissionAttributes> implements RolePermissionAttributes {
  public roleId!: number;
  public permissionId!: number;
}

RolePermission.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Role,
        key: 'id',
      },
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Permission,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'role_permissions',
    timestamps: false,
  }
);

export default RolePermission;
