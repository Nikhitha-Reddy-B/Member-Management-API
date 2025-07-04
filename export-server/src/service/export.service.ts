import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { ExportExcelRequest, ExportExcelResponse } from '../types/export.types';
import { generateExcelFile } from './excelExport.service';

export const handleExportExcel = async (
  call: ServerUnaryCall<ExportExcelRequest, ExportExcelResponse>,
  callback: sendUnaryData<ExportExcelResponse>
) => {
  try {
    const { type } = call.request;
    console.log(`Requested export type: ${type}`);

    const fileName = await generateExcelFile(type);
    const fileUrl = `http://localhost:4040/exports/${fileName}`;
    console.log(`File URL: ${fileUrl}`);

    callback(null, { fileUrl });
  } catch (error) {
    console.error('Error exporting data:', error);
    callback({
      code: status.INTERNAL,
      message: (error as Error).message || 'Failed to export data',
    });
  }
};
