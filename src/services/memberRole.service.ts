import Member from '../models/member.model';
import Role from '../models/role.model';

export const assignRoleToMemberService = async (memberId: number, roleId: number) => {
  const member = await Member.findOne({ where: { id: memberId } });
  const role = await Role.findOne({ where: { id: roleId } });

  if (member && role) await member.addRole(role);
  return { member, role };
};

export const getAllMemberRolesService = async () => {
  return await Member.findAll({
    attributes:['id', 'name', 'email'],
    include: {
      model: Role,
      as: 'roles',
      attributes: ['id', 'name'],
      through: { attributes: [] },
    },
  });
};

export const getRolesForMemberService = async (memberId: number) => {
  const member = await Member.findOne({
    where: { id: memberId },
    attributes: ['id', 'name', 'email'],
    include: {
      model: Role,
      as: 'roles',
      attributes: ['id', 'name'],
      through: { attributes: [] }, 
    },
  });
  if(!member) return null;
  return member;
};

export const removeRoleFromMemberService = async (memberId: number, roleId: number) => {
  const member = await Member.findOne({ where: { id: memberId } });
  const role = await Role.findOne({ where: { id: roleId } });

  if (member && role) await member.removeRole(role);
  return { member, role };
};

export const updateMemberRoleService = async (memberId: number, oldRoleId: number, newRoleId: number) => {
  const member = await Member.findOne({ where: { id: memberId } });
  const oldRole = await Role.findOne({ where: { id: oldRoleId } });
  const newRole = await Role.findOne({ where: { id: newRoleId } });

  if (member && oldRole && newRole) {
    await member.removeRole(oldRole);
    await member.addRole(newRole);
  }

  return { member, oldRole, newRole };
};

export const getAllRolesWithMembersService = async () => {
  return await Role.findAll({
    attributes: ['id', 'name'],
    include: {
      model: Member,
      as: 'members',
      attributes: ['id', 'name', 'email'],
      through: { attributes: [] },
    },
  });
};

export const getMembersForRoleService = async (roleId: number) => {
  const role = await Role.findOne({ 
    where: { id: roleId },
    attributes: ['id', 'name'],
    include: {
        model : Member,
        as: 'members',
        attributes: ['id', 'name', 'email'],
        through: {attributes: [] }, 
    },
  });
  if(!role) return null;
  return role;
};

export const assignMemberToRoleService = async (roleId: number, memberId: number) => {
  const role = await Role.findOne({ where: { id: roleId } });
  const member = await Member.findOne({ where: { id: memberId } });

  if (role && member) await role.addMember(member);
  return { role, member };
};

export const removeMemberFromRoleService = async (roleId: number, memberId: number) => {
  const role = await Role.findOne({ where: { id: roleId } });
  const member = await Member.findOne({ where: { id: memberId } });

  if (role && member) await role.removeMember(member);
  return { role, member };
};

export const updateMemberForRoleService = async (roleId: number, oldMemberId: number, newMemberId: number) => {
  const role = await Role.findOne({ where: { id: roleId } });
  const oldMember = await Member.findOne({ where: { id: oldMemberId } });
  const newMember = await Member.findOne({ where: { id: newMemberId } });

  if (role && oldMember && newMember) {
    await role.removeMember(oldMember);
    await role.addMember(newMember);
  }

  return { role, oldMember, newMember };
};
