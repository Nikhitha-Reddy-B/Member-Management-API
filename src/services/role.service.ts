import Role from '../models/role.model';

export const createRole = async (name: string, description: string) => {
  return await Role.create({ name, description });
};

export const getAllRoles = async () => {
  return await Role.findAll();
};

export const getRoleById = async (id: number) => {
  return await Role.findOne({ where: { id } });
};

export const updateRole = async (id: number, name: string, description: string) => {
  const role = await Role.findOne({ where: { id } });
  if (!role) return null;

  await role.update({ name, description });
  return role;
};

export const deleteRole = async (id: number) => {
  return await Role.destroy({ where: { id } });
};
