import { Request, Response, NextFunction } from 'express';
import { uploadTaskClient } from '../utils/uploadTaskClient';
import { TaskCreationAttributes } from '../types/models';
import { ServiceError } from '@grpc/grpc-js';
import { UploadTaskExcelResponse } from '../types/upload.types';

export const uploadTaskExcel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const tasks: TaskCreationAttributes[] = req.body.tasks;
  const failedRows = req.body.failedRows || [];

  uploadTaskClient.UploadTaskExcel({ tasks }, (err: ServiceError | null, response: UploadTaskExcelResponse) => {
    if (err) {
      console.error('gRPC upload task error:', err);
      res.status(500).json({ message: 'Failed to process tasks', grpcDetails: err.details, grpcCode: err.code });
      return;
    }

    res.status(200).json({
      message: 'Task data processed',
      successCount: response.successCount,
      failureCount: failedRows.length,
      failedRows,
    });
  });
};
