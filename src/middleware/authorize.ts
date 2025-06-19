import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MemberPayload } from '../types/memberPayload';
import Role from '../models/role.model';
import Permission from '../models/permissions.model';
import Member from '../models/member.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const authorize =
  (resource: 'roles' | 'members', action: 'create' | 'read' | 'update' | 'delete') =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as MemberPayload;

      const member = await Member.findByPk(decoded.id);
      if (!member) {
        return res.status(401).json({ error: 'Member no longer exists' });
      }

      const memberRoles = decoded.roles;
      const requiredPermission = `${resource}:${action}`.toLowerCase();

      const permissions = await Permission.findAll({
        include: [
          {
            model: Role,
            as: 'roles',
            where: { name: memberRoles },
            through: { attributes: [] },
          },
        ],
      });

      const allowed = permissions.some(
        (perm) => `${perm.resource}:${perm.action}`.toLowerCase() === requiredPermission
      );

      if (!allowed) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
      }

      res.locals.member = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
