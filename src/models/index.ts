import Member from './member.model';
import Role from './role.model';
import MemberRole from './memberRole.model';
import Permission from './permissions.model';
import RolePermission from './rolePermissions.model';
import Task from './task.model';

Member.belongsToMany(Role, {
  through: MemberRole,
  foreignKey: 'memberId',
  otherKey: 'roleId',
  onDelete: 'CASCADE',
  as: 'roles',
});

Role.belongsToMany(Member, {
  through: MemberRole,
  foreignKey: 'roleId',
  otherKey: 'memberId',
  onDelete: 'CASCADE',
  as: 'members',
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  onDelete: 'CASCADE',
  as: 'permissions',
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  onDelete: 'CASCADE',
  as: 'roles',
});

Task.belongsTo(Member, {
  foreignKey: 'assignee',
  as: 'assigneeDetails'
});

Task.belongsTo(Member, {
  foreignKey: 'reporter',
  as: 'reporterDetails'
});

Member.hasMany(Task, {
  foreignKey: 'assignee',
  as: 'assignedTasks'
});

Member.hasMany(Task, {
  foreignKey: 'reporter',
  as: 'reportedTasks'
});



export { Member, Role, MemberRole, Permission, RolePermission, Task };
