import express from 'express';
import * as exportController from '../controllers/export.controller';

const router = express.Router();

router.get('/excel', exportController.exportExcel);

export default router;
