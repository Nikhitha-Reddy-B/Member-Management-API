import express from 'express';
import * as MemberRoleController from '../controllers/memberRole.controller';
import { authorize } from '../middleware/authorize';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MemberRoles
 *   description: APIs for managing member-role relationships
 */

/**
 * @swagger
 * /member_roles/assign:
 *   post:
 *     summary: Assign a role to a member
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
router.post('/assign', authorize('members', 'update'), MemberRoleController.assignRoleToMember);

/**
 * @swagger
 * /member_roles:
 *   get:
 *     summary: Get all member-role associations
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all member-role associations
 */
router.get('/', authorize('members', 'read'), MemberRoleController.getAllMemberRoles);

/**
 * @swagger
 * /member_roles/remove:
 *   delete:
 *     summary: Remove a role from a member
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role removed successfully
 */
router.delete('/remove', authorize('members', 'update'), MemberRoleController.removeRoleFromMember);

/**
 * @swagger
 * /member_roles/update:
 *   put:
 *     summary: Update a member's role
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               oldRoleId:
 *                 type: string
 *               newRoleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member's role updated
 */
router.put('/update', authorize('members', 'update'), MemberRoleController.updateMemberRole);

/**
 * @swagger
 * /member_roles/{memberId}/roles:
 *   get:
 *     summary: Get all roles for a specific member
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/:memberId/roles', authorize('roles', 'read'), MemberRoleController.getRolesForMember);

/**
 * @swagger
 * /member_roles/with-members:
 *   get:
 *     summary: Get all roles with their members
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles and members
 */
router.get('/with-members', authorize('roles', 'read'), MemberRoleController.getAllRolesWithMembers);

/**
 * @swagger
 * /member_roles/{roleId}/members:
 *   get:
 *     summary: Get all members for a specific role
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of members
 */
router.get('/:roleId/members', authorize('roles', 'read'), MemberRoleController.getMembersForRole);

/**
 * @swagger
 * /member_roles/assign-member:
 *   post:
 *     summary: Assign a member to a role (alternate endpoint)
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *               memberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member assigned to role
 */
router.post('/assign-member', authorize('roles', 'update'), MemberRoleController.assignMemberToRole);

/**
 * @swagger
 * /member_roles/remove-member:
 *   delete:
 *     summary: Remove a member from a role (alternate endpoint)
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *               memberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed from role
 */
router.delete('/remove-member', authorize('roles', 'update'), MemberRoleController.removeMemberFromRole);

/**
 * @swagger
 * /member_roles/update-member:
 *   put:
 *     summary: Update a role's member (alternate endpoint)
 *     tags: [MemberRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *               oldMemberId:
 *                 type: string
 *               newMemberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated for role
 */
router.put('/update-member', authorize('roles', 'update'), MemberRoleController.updateMemberForRole);

export default router;
