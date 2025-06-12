import { Request, Response } from 'express';
import Joi from 'joi';
import { roleSchema } from '../validations/role.schema';
import { idSchema } from '../validations/id.schema';
import * as roleService from '../services/role.service';
import MemberRole from '../models/memberRole.model';

export const create = async (req: Request, res: Response) => {
  const { error } = roleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message),
    });
  }

  try {
    const { name, description } = req.body;
    const role = await roleService.createRole(name, description);
    res.status(201).json(role);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const { error } = idSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message),
    });
  }

  try {
    const role = await roleService.getRoleById(Number(req.params.id));
    if (!role) return res.status(404).send('Role not found');
    res.json(role);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { error: idError } = idSchema.validate(req.params.id);
  if (idError) {
    return res.status(400).json({
      errors: idError.details.map((detail: Joi.ValidationErrorItem) => detail.message),
    });
  }

  const { error: bodyError } = roleSchema.validate(req.body, { abortEarly: false });
  if (bodyError) {
    return res.status(400).json({
      errors: bodyError.details.map((detail: Joi.ValidationErrorItem) => detail.message),
    });
  }

  try {
    const { name, description } = req.body;
    const updated = await roleService.updateRole(Number(req.params.id), name, description);
    if (!updated) return res.status(404).send('Role not found');
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { error } = idSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail: Joi.ValidationErrorItem) => detail.message),
    });
  }

  try {
    await MemberRole.destroy({ where: { roleId: req.params.id } });
    const deleted = await roleService.deleteRole(Number(req.params.id));
    if (!deleted) return res.status(404).send('Role not found');
    res.send(`Role with id ${req.params.id} deleted`);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
