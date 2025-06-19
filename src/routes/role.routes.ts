import { Router } from 'express';
import * as roleController from '../controllers/role.controller';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authorize('roles', 'read'), roleController.getAll);
router.get('/:id', authorize('roles', 'read'), roleController.getById);
router.post('/', authorize('roles', 'create'), roleController.create);
router.put('/:id', authorize('roles', 'update'), roleController.update);
router.delete('/:id', authorize('roles', 'delete'), roleController.remove);

export default router;
