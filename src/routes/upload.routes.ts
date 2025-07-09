import express from 'express';
import { excelUpload } from '../middleware/upload';
import { validateTaskExcelMiddleware } from '../middleware/validateTask.middleware'; 
import { uploadExcel } from '../controllers/upload.controller';
import { uploadTaskExcel } from '../controllers/uploadTask.controller';

const router = express.Router();

router.post('/upload-excel', excelUpload.single('file'), uploadExcel);

router.post(
  '/upload-task-excel',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Route matched: /upload-task-excel');
    next();
  },
  excelUpload.single('file'),
  validateTaskExcelMiddleware, 
  uploadTaskExcel
);

export default router;
