import Member from '../models/member.model';
import Role from '../models/role.model';
import MemberRole from '../models/memberRole.model';
import { Op } from 'sequelize';

export const createMember = async (
  name: string,
  email: string,
  password: string,
  username?: string,
  phone?: string,
  isActive: boolean = true,
  profilePicture?: string
) => {
  return await Member.create({ name, email, password, username, phone, isActive, profilePicture });
};

export const getAllMembers = async () => {
  return await Member.findAll();
};

export const getMemberById = async (id: number) => {
  return await Member.findOne({ where: { id } });
};

export const updateMember = async (
  id: number,
  name: string,
  email: string,
  username: string,
  phone: string,
  isActive: boolean,
  profilePicture: string
) => {
  const member = await Member.findOne({ where: { id } });
  if (!member) return null;

  await member.update({ name, email, username, phone, isActive, profilePicture });
  return member;
};

export const deleteMember = async (id: number) => {
  return await Member.destroy({ where: { id } });
};

export const searchMembers = async (filters: any) => {
  const whereClause: any = {};

  if (filters.username) {
    whereClause.username = { [Op.iLike]: `%${filters.username}%` };
  }
  if (filters.email) {
    whereClause.email = { [Op.iLike]: `%${filters.email}%` };
  }
  if (filters.phone) {
    whereClause.phone = { [Op.iLike]: `%${filters.phone}%` };
  }
  if (filters.isActive !== undefined) {
    whereClause.isActive = filters.isActive === 'true';
  }

  return Member.findAll({ where: whereClause });
};

