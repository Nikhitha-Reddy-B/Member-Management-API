import express from 'express';
import { excelUpload } from '../middleware/upload';
import { uploadExcel } from '../controllers/upload.controller';

const router = express.Router();

router.post('/upload-excel', excelUpload.single('file'), uploadExcel);

export default router;
