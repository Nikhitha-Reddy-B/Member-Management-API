import { Request, Response, NextFunction } from 'express';
import * as ExcelJS from 'exceljs';
import { Member } from '../models';
import { taskSchema } from '../validations/task.schema';
import { TaskCreationAttributes } from '../types/models';

export const validateTaskExcelMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('>>> validateTaskExcelMiddleware called');

  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      res.status(400).json({ message: 'No worksheet found in file' });
      return;
    }

    const tasks: TaskCreationAttributes[] = [];
    const failedRows: { rowNumber: number; reason: string }[] = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const phone = row.getCell(2).text?.trim();
      if (!phone) {
        failedRows.push({ rowNumber, reason: 'Phone number is required' });
        continue;
      }
      
      const member = await Member.findOne({ where: { phone } });
      if (!member) {
        failedRows.push({ rowNumber, reason: 'Member not found with this phone number' });
        continue;
      }

      const title = row.getCell(3).text?.trim() || '';
      const description = row.getCell(4).text?.trim() || '';
      let status = row.getCell(5).text?.trim() as 'todo' | 'inprogress' | 'done';
      const startDateStr = row.getCell(6).text?.trim();
      const endDateStr = row.getCell(7).text?.trim();

      if (!['todo', 'inprogress', 'done'].includes(status)) {
        status = 'todo';
      }

      const taskData: TaskCreationAttributes = {
        title,
        description,
        status,
        assignee: member.id,
        startDate: startDateStr ? new Date(startDateStr) : new Date(),
        endDate: endDateStr ? new Date(endDateStr) : new Date(),
      };

      const { error } = taskSchema.validate(taskData, { abortEarly: false });
      if (error) {
        failedRows.push({ rowNumber, reason: error.details.map((d) => d.message).join('; ') });
        continue;
      }

      tasks.push(taskData);
    }

    req.body.tasks = tasks;
    req.body.failedRows = failedRows;
    next();
  } catch (error) {
    console.error('Error parsing Excel:', error);
    res.status(500).json({ message: 'Failed to parse Excel file', error: (error as Error).message });
  }
};