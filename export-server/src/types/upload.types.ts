export interface UploadExcelRequest {
    file: Buffer;
}

export interface FailedRow {
    rowNumber: number;
    reason: string;
}

export interface UploadExcelResponse {
    successCount: number;
    failureCount: number;
    failedRows: FailedRow[];
}

export interface UploadTaskExcelRequest {
  file: Buffer;
}

export interface UploadTaskExcelResponse {
  successCount: number;
  failureCount: number;
  failedRows: FailedRow[];
}

export interface FailedRow {
  rowNumber: number;
  reason: string;
}
