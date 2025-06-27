import { NextFunction, Request, Response } from 'express';
import { memberSchema } from '../validations/member.schema';
import { idSchema } from '../validations/id.schema';
import * as memberService from '../services/member.service';
import MemberRole from '../models/memberRole.model';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';


export const create = async (req: Request, res: Response) => {
  const { error } = memberSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  try {
    const { name, email, password, username, phone, isActive = true, profilePicture, roleId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = await memberService.createMember(name, email, hashedPassword, username, phone, isActive, profilePicture);

    if (roleId) {
      await MemberRole.create({ memberId: newMember.id, roleId });
    }

    res.status(201).json(await memberService.getMemberById(newMember.id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const members = await memberService.searchMembers(filters);
    res.json(members);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const { error } = idSchema.validate(Number(req.params.id));
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  try {
    const member = await memberService.getMemberById(Number(req.params.id));
    if (!member) return res.status(404).send('Member not found');
    res.json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { error: idError } = idSchema.validate(Number(req.params.id));
  if (idError) return res.status(400).json({ errors: idError.details.map(d => d.message) });

  const { error: bodyError } = memberSchema.validate(req.body, { abortEarly: false });
  if (bodyError) return res.status(400).json({ errors: bodyError.details.map(d => d.message) });

  try {
    const { name, email, username, phone, isActive, profilePicture, roleId } = req.body;

    const updated = await memberService.updateMember(
      Number(req.params.id),
      name,
      email,
      username,
      phone,
      isActive,
      profilePicture
    );
    if (!updated) return res.status(404).send('Member not found');

    if (roleId) {
      await MemberRole.destroy({ where: { memberId: Number(req.params.id) } });
      await MemberRole.create({ memberId: Number(req.params.id), roleId });
    }

    const updatedMember = await memberService.getMemberById(Number(req.params.id));
    res.json(updatedMember);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { error } = idSchema.validate(Number(req.params.id));
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  try {
    await MemberRole.destroy({ where: { memberId: Number(req.params.id) } });
    const deleted = await memberService.deleteMember(Number(req.params.id));
    if (!deleted) return res.status(404).send('Member not found');
    res.send(`Member with id ${req.params.id} deleted`);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const memberId = Number(req.params.id);

    if(isNaN(memberId)){
      throw new ApiError('Invalid member Id', 400);
    }

    const filename = await memberService.handleProfilePictureUpload(memberId, req.file);

    return res.status(200).json({
      message: 'Photo uploaded successfully',
      file: filename,
    });
  } catch(err) {
    next(err);
  }
};


