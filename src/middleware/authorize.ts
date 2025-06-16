import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissions } from '../constants/permissions';
import { MemberPayload } from '../types/memberPayload'; 

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const authorize =
  (resource: 'roles' | 'members', action: 'create' | 'read' | 'update' | 'delete') =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as MemberPayload;
      const memberRoles: string[] = decoded.roles;

      const hasPermission = memberRoles.some((role) => {
        const roleKey = role.replace(/\s+/g, '_').toUpperCase();
        const permissionsForRole = Permissions[roleKey as keyof typeof Permissions];
        return permissionsForRole?.[resource]?.includes(action);
      });

      if (!hasPermission) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
      }

      res.locals.member = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
