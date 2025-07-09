import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { UploadExcelRequest, UploadExcelResponse, UploadTaskExcelRequest, UploadTaskExcelResponse } from '../types/upload.types';
import { processUploadExcel } from './uploadExcel.service';
import { processUploadTaskExcel } from './uploadTaskExcel.service';
import { TaskCreationAttributes } from '../../../src/types/models';

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

export const handleUploadTaskExcel = async (
  call: ServerUnaryCall<UploadTaskExcelRequest, UploadTaskExcelResponse>,
  callback: sendUnaryData<UploadTaskExcelResponse>
) => {
  try {
      const tasks: TaskCreationAttributes[] = call.request.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      status: task.status as 'todo' | 'inprogress' | 'done',
      assignee: task.assignee,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
    }));
    const result = await processUploadTaskExcel(tasks);
    callback(null, result);
  } catch (error) {
    console.error('Error processing tasks:', error);
    callback({
      code: status.INTERNAL,
      message: (error as Error).message || 'Failed to process tasks',
    });
  }
};