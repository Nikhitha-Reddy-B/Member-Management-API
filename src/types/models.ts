export interface MemberAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAttributes {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberRoleAttributes {
  memberId: number;
  roleId: number;
}

export interface PermissionAttributes {
  id: number;
  resource: string;
  action: string;
}

export interface RolePermissionAttributes {
  roleId: number;
  permissionId: number;
}
