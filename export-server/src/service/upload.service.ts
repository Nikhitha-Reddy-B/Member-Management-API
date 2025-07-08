import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { UploadExcelRequest, UploadExcelResponse } from '../types/upload.types';
import { processUploadExcel } from './uploadExcel.service';

export const handleUploadExcel = async (
  call: ServerUnaryCall<UploadExcelRequest, UploadExcelResponse>,
  callback: sendUnaryData<UploadExcelResponse>
) => {
  try {
    const buffer = call.request.file;
    const result = await processUploadExcel(buffer);
    callback(null, result);
  } catch (error) {
    console.error('Error uploading excel:', error);
    callback({
      code: status.INTERNAL,
      message: (error as Error).message || 'Failed to upload Excel data',
    });
  }
};
