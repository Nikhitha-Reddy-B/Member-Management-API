import * as ExcelJS from 'exceljs';
import bcrypt from 'bcrypt';
import pLimit from 'p-limit';
import { Member } from '../../../src/models';
import { UploadExcelResponse, FailedRow } from '../types/upload.types';
import { memberSchema } from '../../../src/validations/member.schema';
import type { CellValue } from 'exceljs';
import { UniqueConstraintError, ValidationError } from 'sequelize';

interface MemberData {
  name?: string;
  email?: string;
  password?: string;
  username?: string;
  phone?: string;
  isActive: boolean;
  profilePicture?: string;
}

const getCellString = (cellValue: CellValue): string | undefined => {
  if (cellValue === null || cellValue === undefined) return undefined;
  if (typeof cellValue === 'object' && 'text' in cellValue && typeof cellValue.text === 'string') {
    return cellValue.text.trim();
  }
  return String(cellValue).trim();
};

export const processUploadExcel = async (buffer: Buffer): Promise<UploadExcelResponse> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error('No worksheet found in uploaded file');
  }

  const failedRows: FailedRow[] = [];
  const validEntries: { data: MemberData; rowNumber: number }[] = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);

    const memberData: MemberData = {
      name: getCellString(row.getCell(2).value),
      email: getCellString(row.getCell(3).value),
      password: getCellString(row.getCell(4).value),
      username: getCellString(row.getCell(5).value),
      phone: getCellString(row.getCell(6).value),
      isActive: row.getCell(7).value !== undefined ? Boolean(row.getCell(7).value) : true,
      profilePicture: getCellString(row.getCell(8).value),
    };

    try {
      if (!memberData.password) {
        throw new Error('Password is required');
      }

      const { error } = memberSchema.validate(memberData, { abortEarly: false });
      if (error) {
        throw new Error(error.details.map((d) => d.message).join('; '));
      }

      validEntries.push({ data: memberData, rowNumber });
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Unknown error';
      failedRows.push({ rowNumber, reason });
    }
  }

  const limit = pLimit(10);

  await Promise.all(
    validEntries.map((entry) =>
      limit(async () => {
        entry.data.password = await bcrypt.hash(entry.data.password!, 10);
      })
    )
  );

  const successfullyInserted: number[] = [];

  for (const entry of validEntries) {
    let reason = '';

    try {
      await Member.create({
        name: entry.data.name,
        email: entry.data.email,
        password: entry.data.password,
        username: entry.data.username,
        phone: entry.data.phone,
        isActive: entry.data.isActive,
        profilePicture: entry.data.profilePicture,
      });

      successfullyInserted.push(entry.rowNumber);
    } catch (err) {
      if (err instanceof UniqueConstraintError || err instanceof ValidationError) {
        reason = err.errors.map((e) => e.message).join('; ');
      } else if (err instanceof Error) {
        reason = err.message;
      } else {
        reason = 'Unknown error';
      }

      failedRows.push({ rowNumber: entry.rowNumber, reason });
    }
  }

  return {
    successCount: successfullyInserted.length,
    failureCount: failedRows.length,
    failedRows,
  };
};
