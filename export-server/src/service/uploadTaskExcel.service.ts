import * as ExcelJS from 'exceljs';
import { Member, Task } from '../../../src/models';
import { UploadTaskExcelResponse, FailedRow } from '../types/upload.types';
import { TaskCreationAttributes } from '../../../src/types/models';
import type { CellValue } from 'exceljs';
import { taskSchema } from '../../../src/validations/task.schema';

interface TaskExcelData {
  title?: string;
  description?: string;
  status?: 'todo' | 'inprogress' | 'done';
  assignee?: number;
  startDate?: Date;
  endDate?: Date;
}

const getCellString = (cellValue: CellValue): string | undefined => {
  if (cellValue === null || cellValue === undefined) return undefined;
  if (typeof cellValue === 'object' && 'text' in cellValue && typeof cellValue.text === 'string') {
    return cellValue.text.trim();
  }
  return String(cellValue).trim();
};

export const processUploadTaskExcel = async (buffer: Buffer): Promise<UploadTaskExcelResponse> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error('No worksheet found in uploaded file');
  }

  const failedRows: FailedRow[] = [];
  const validEntries: { data: TaskExcelData; rowNumber: number }[] = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    const userPhone = getCellString(row.getCell(2).value);

    try {
      if (!userPhone) {
        throw new Error('Member phone number is required');
      }

      const member = await Member.findOne({ where: { phone: userPhone } });
      if (!member) {
        throw new Error('Member not found with given phone number');
      }

      const taskData: TaskExcelData = {
        title: getCellString(row.getCell(3).value),
        description: getCellString(row.getCell(4).value),
        status: (getCellString(row.getCell(5).value) as 'todo' | 'inprogress' | 'done') || 'todo',
        assignee: member.id,
        startDate: new Date(getCellString(row.getCell(6).value)!),
        endDate: new Date(getCellString(row.getCell(7).value)!),
      };

      const { error } = taskSchema.validate(taskData, { abortEarly: false });
      if (error) {
        throw new Error(error.details.map((d) => d.message).join('; '));
      }

      validEntries.push({ data: taskData, rowNumber });
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Unknown error';
      failedRows.push({ rowNumber, reason });
    }
  }

  const successfullyInserted: number[] = [];

  for (const entry of validEntries) {
    let reason = '';

    try {
      await Task.create({
        title: entry.data.title,
        description: entry.data.description,
        status: entry.data.status ?? 'todo',
        assignee: entry.data.assignee,
        startDate: entry.data.startDate,
        endDate: entry.data.endDate,
      }as TaskCreationAttributes);

      successfullyInserted.push(entry.rowNumber);
    } catch (err) {
      reason = err instanceof Error ? err.message : 'Unknown error';
      failedRows.push({ rowNumber: entry.rowNumber, reason });
    }
  }

  return {
    successCount: successfullyInserted.length,
    failureCount: failedRows.length,
    failedRows,
  };
};
