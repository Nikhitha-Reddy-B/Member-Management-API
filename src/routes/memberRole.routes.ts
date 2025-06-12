import express from 'express';
import * as MemberRoleController from '../controllers/memberRole.controller';

const router = express.Router();

router.post('/assign', MemberRoleController.assignRoleToMember);
router.get('/', MemberRoleController.getAllMemberRoles);
router.get('/:memberId/roles', MemberRoleController.getRolesForMember);
router.delete('/remove', MemberRoleController.removeRoleFromMember);
router.put('/update', MemberRoleController.updateMemberRole);
router.get('/with-members', MemberRoleController.getAllRolesWithMembers);
router.get('/:roleId/members', MemberRoleController.getMembersForRole);
router.post('/assign-member', MemberRoleController.assignMemberToRole);
router.delete('/remove-member', MemberRoleController.removeMemberFromRole);
router.put('/update-member', MemberRoleController.updateMemberForRole);

export default router;
