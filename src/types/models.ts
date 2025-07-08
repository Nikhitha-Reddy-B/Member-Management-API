export interface MemberAttributes {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  profilePicture: string;
  password: string;
  isActive: boolean;
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

export interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  assignee: number;      
  reporter?: number;      
  startDate: Date;
  endDate: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface TaskFilterOptions {
  assigneeName?: string;
  reporterName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

