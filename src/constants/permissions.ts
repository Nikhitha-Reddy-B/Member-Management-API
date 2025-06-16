export const Permissions = {
  SUPER_ADMIN: {
    roles: ['create', 'read', 'update', 'delete'],
    members: ['create', 'read', 'update', 'delete'],
  },
  ADMIN: {
    roles: ['read'],
    members: ['create', 'read', 'update', 'delete'],
  },
  USER: {
    roles: ['read'],
    members: ['create', 'read', 'update'],
  },
};
