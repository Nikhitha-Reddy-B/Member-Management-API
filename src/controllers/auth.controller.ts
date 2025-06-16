import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Member from '../models/member.model';
import Role from '../models/role.model';
import MemberRole from '../models/memberRole.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password'],
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
        through: { attributes: [] },
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

   const memberWithRoles = member as Member & { roles: Role[] };
   const roles = memberWithRoles.roles?.map((role) => role.name) || [];

    const token = jwt.sign(
      { id: member.id, email: member.email, roles },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        roles,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const register = async (req: Request, res: Response) => {
  const { name, email, password, role = 'User' } = req.body;

  try {
    const existingMember = await Member.findOne({ where: { email } });
    if (existingMember) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await Member.create({
      name,
      email,
      password: hashedPassword,
    });

    const foundRole = await Role.findOne({ where: { name: role } });
    if (!foundRole) {
      return res.status(400).json({ error: `Role '${role}' does not exist` });
    }

    await MemberRole.create({
      memberId: member.id,
      roleId: foundRole.id,
    });

    res.status(201).json({
      message: 'Registration successful',
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: foundRole.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};