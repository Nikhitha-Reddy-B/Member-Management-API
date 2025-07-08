import express from 'express';
import { excelUpload } from '../middleware/upload';
import { uploadExcel } from '../controllers/upload.controller';
import { uploadTaskExcel } from '../controllers/uploadTask.controller';

const router = express.Router();

router.post('/upload-excel', excelUpload.single('file'), uploadExcel);
router.post('/upload-task-excel', excelUpload.single('file'), uploadTaskExcel);

export default router;
