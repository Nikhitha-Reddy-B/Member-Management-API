import { Request, Response, NextFunction } from 'express';
import { exportClient } from '../utils/exportClient';
import { ExportExcelResponse } from '../types/export.types';
import { ServiceError } from '@grpc/grpc-js';

export const exportExcel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { type } = req.query;

  if (!type || typeof type !== 'string') {
    res.status(400).json({ message: 'Type query param is required (members, tasks, or all)' });
    return;
  }

  exportClient.ExportExcel({ type }, (err: ServiceError | null, response: ExportExcelResponse) => {
    if (err) {
      console.error('gRPC export error:', err);
      res.status(500).json({ message: 'Failed to export data' });
      return;
    }

    res.status(200).json({
      message: 'Export successful',
      fileUrl: response.fileUrl,
    });
  });
};
