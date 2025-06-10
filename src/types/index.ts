export interface MemberAttributes {
  id: string;
  name: string;
  email: string;
  password: string
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAttributes {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberRoleAttributes {
  memberId: string;
  roleId: string;
}