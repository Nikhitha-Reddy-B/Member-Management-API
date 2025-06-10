import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Member from '../models/member.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password'],
    });

    if (!member) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: member.id, email: member.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
