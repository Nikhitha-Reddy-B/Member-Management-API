import express from 'express';
import * as MemberRoleController from '../controllers/memberRole.controller';
import { authorize } from '../middleware/authorize';

const router = express.Router();
router.post('/assign', authorize('members', 'update'), MemberRoleController.assignRoleToMember);
router.get('/', authorize('members', 'read'), MemberRoleController.getAllMemberRoles);
router.delete('/remove', authorize('members', 'update'), MemberRoleController.removeRoleFromMember);
router.put('/update', authorize('members', 'update'), MemberRoleController.updateMemberRole);

router.get('/:memberId/roles', authorize('roles', 'read'), MemberRoleController.getRolesForMember);
router.get('/with-members', authorize('roles', 'read'), MemberRoleController.getAllRolesWithMembers);
router.get('/:roleId/members', authorize('roles', 'read'), MemberRoleController.getMembersForRole);
router.post('/assign-member', authorize('roles', 'update'), MemberRoleController.assignMemberToRole);
router.delete('/remove-member', authorize('roles', 'update'), MemberRoleController.removeMemberFromRole);
router.put('/update-member', authorize('roles', 'update'), MemberRoleController.updateMemberForRole);

export default router;
