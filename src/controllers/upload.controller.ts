import { Request, Response, NextFunction } from 'express';
import { uploadClient } from '../utils/uploadClient';
import { UploadExcelResponse } from '../types/upload.types';
import { ServiceError } from '@grpc/grpc-js';

export const uploadExcel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const buffer = req.file.buffer;

  uploadClient.UploadExcel({ file: buffer }, (err: ServiceError | null, response: UploadExcelResponse) => {
    if (err) {
      console.error('gRPC upload error:', err);
      res.status(500).json({ message: 'Failed to upload and process file', grpcDetails: err.details, grpcCode: err.code });
      return;
    }

    res.status(200).json({
      message: 'File processed',
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedRows: response.failedRows,
    });
  });
};
