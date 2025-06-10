import Member from '../models/member.model';
import Role from '../models/role.model';
import MemberRole from '../models/memberRole.model';

export const createMember = async (name: string, email: string, password: string) => {
  return await Member.create({ name, email, password });
};

export const getAllMembers = async () => {
  return await Member.findAll();
};

export const getMemberById = async (id: string) => {
  return await Member.findByPk(id);
};

export const updateMember = async (id: string, name: string, email: string) => {
  const member = await Member.findByPk(id);
  if (!member) return null;

  await member.update({ name, email });
  return member;
};

export const deleteMember = async (id: string) => {
  return await Member.destroy({ where: { id } });
};
