import express from 'express';
import * as memberController from '../controllers/member.controller';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', authorize('members', 'read'), memberController.getAll);
router.get('/:id', authorize('members', 'read'), memberController.getById);
router.post('/', authorize('members', 'create'), memberController.create);
router.put('/:id', authorize('members', 'update'), memberController.update);
router.delete('/:id', authorize('members', 'delete'), memberController.remove);
router.post('/:id/profile-picture', authorize('members', 'update'),upload.single('file'), memberController.uploadProfilePicture);

export default router;
