import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { validate } from '../validations/validate';
import { taskSchema, taskSchemaForUpdate } from '../validations/task.schema';
import { idSchema } from '../validations/id.schema';

const router = Router();

router.post('/', validate(taskSchema), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', validate(idSchema, 'params'), taskController.getTaskById);
router.put('/:id', validate(idSchema, 'params'), validate(taskSchemaForUpdate), taskController.updateTask);
router.delete('/:id', validate(idSchema, 'params'), taskController.deleteTask);

export default router;
