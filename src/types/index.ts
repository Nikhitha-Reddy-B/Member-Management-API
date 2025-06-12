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
