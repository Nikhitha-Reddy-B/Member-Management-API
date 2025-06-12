import { Request, Response } from 'express';
import * as MemberRoleService from '../services/memberRole.service';

export const assignRoleToMember = async (req: Request, res: Response) => {
  const { memberId, roleId } = req.body;

  try {
    const result = await MemberRoleService.assignRoleToMemberService(memberId, roleId);

    if (!result.member) return res.status(404).json({ error: 'Member not found' });
    if (!result.role) return res.status(404).json({ error: 'Role not found' });

    res.status(200).json({ message: 'Role assigned to member successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMemberRoles = async (_req: Request, res: Response) => {
  try {
    const members = await MemberRoleService.getAllMemberRolesService();
    res.status(200).json(members);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRolesForMember = async (req: Request, res: Response) => {
  const { memberId } = req.params;

  try {
    const result = await MemberRoleService.getRolesForMemberService(Number(memberId));
    if (!result) return res.status(404).json({ error: 'Member not found' });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeRoleFromMember = async (req: Request, res: Response) => {
  const { memberId, roleId } = req.body;

  try {
    const result = await MemberRoleService.removeRoleFromMemberService(memberId, roleId);

    if (!result.member) return res.status(404).json({ error: 'Member not found' });
    if (!result.role) return res.status(404).json({ error: 'Role not found' });

    res.status(200).json({ message: 'Role removed from member successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMemberRole = async (req: Request, res: Response) => {
  const { memberId, oldRoleId, newRoleId } = req.body;

  try {
    const result = await MemberRoleService.updateMemberRoleService(memberId, oldRoleId, newRoleId);

    if (!result.member) return res.status(404).json({ error: 'Member not found' });
    if (!result.oldRole) return res.status(404).json({ error: 'Old role not found' });
    if (!result.newRole) return res.status(404).json({ error: 'New role not found' });

    res.status(200).json({ message: 'Role updated for member successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRolesWithMembers = async (_req: Request, res: Response) => {
  try {
    const roles = await MemberRoleService.getAllRolesWithMembersService();
    res.status(200).json(roles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMembersForRole = async (req: Request, res: Response) => {
  const { roleId } = req.params;

  try {
    const result = await MemberRoleService.getMembersForRoleService(Number(roleId));
    if (!result) return res.status(404).json({ error: 'Role not found' });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const assignMemberToRole = async (req: Request, res: Response) => {
  const { roleId, memberId } = req.body;

  try {
    const result = await MemberRoleService.assignMemberToRoleService(roleId, memberId);

    if (!result.role) return res.status(404).json({ error: 'Role not found' });
    if (!result.member) return res.status(404).json({ error: 'Member not found' });

    res.status(200).json({ message: 'Member assigned to role successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeMemberFromRole = async (req: Request, res: Response) => {
  const { roleId, memberId } = req.body;

  try {
    const result = await MemberRoleService.removeMemberFromRoleService(roleId, memberId);

    if (!result.role) return res.status(404).json({ error: 'Role not found' });
    if (!result.member) return res.status(404).json({ error: 'Member not found' });

    res.status(200).json({ message: 'Member removed from role successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMemberForRole = async (req: Request, res: Response) => {
  const { roleId, oldMemberId, newMemberId } = req.body;

  try {
    const result = await MemberRoleService.updateMemberForRoleService(roleId, oldMemberId, newMemberId);

    if (!result.role) return res.status(404).json({ error: 'Role not found' });
    if (!result.oldMember) return res.status(404).json({ error: 'Old member not found' });
    if (!result.newMember) return res.status(404).json({ error: 'New member not found' });

    res.status(200).json({ message: 'Role membership updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
