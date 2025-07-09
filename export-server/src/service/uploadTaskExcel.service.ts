import { Task } from '../../../src/models';
import { TaskCreationAttributes } from '../../../src/types/models';
import { UploadTaskExcelResponse, FailedRow } from '../types/upload.types';

export const processUploadTaskExcel = async (
  tasks: TaskCreationAttributes[]
): Promise<UploadTaskExcelResponse> => {
  const failedRows: FailedRow[] = [];
  const successfullyInserted: number[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    try {
      await Task.create(task);
      successfullyInserted.push(i + 2);
    } catch (err) {
      failedRows.push({
        rowNumber: i + 2,
        reason: (err as Error).message || 'Failed to insert task',
      });
    }
  }

  return {
    successCount: successfullyInserted.length,
    failureCount: failedRows.length,
    failedRows,
  };
};
