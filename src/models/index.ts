import Member from './member.model';
import Role from './role.model';
import MemberRole from './memberRole.model';

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

export { Member, Role, MemberRole };
