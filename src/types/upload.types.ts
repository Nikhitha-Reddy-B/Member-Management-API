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
  tasks: TaskData[]; 
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


export interface TaskData {
  title: string;
  description: string;
  status?: string;
  assignee: number;
  startDate: string; 
  endDate: string;
}

