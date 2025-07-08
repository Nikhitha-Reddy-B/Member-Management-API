import { Request, Response, NextFunction } from 'express';
import { uploadTaskClient } from '../utils/uploadTaskClient';
import { UploadTaskExcelResponse } from '../types/upload.types';
import { ServiceError } from '@grpc/grpc-js';

export const uploadTaskExcel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const buffer = req.file.buffer;

  uploadTaskClient.UploadTaskExcel({ file: buffer }, (err: ServiceError | null, response: UploadTaskExcelResponse) => {
    if (err) {
      console.error('gRPC upload task error:', err);
      res.status(500).json({ message: 'Failed to upload and process task file', grpcDetails: err.details, grpcCode: err.code });
      return;
    }

    res.status(200).json({
      message: 'Task file processed',
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedRows: response.failedRows,
    });
  });
};
