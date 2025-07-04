export interface ExportExcelRequest {
  type: string; // "members", "tasks", or "all"
}

export interface ExportExcelResponse {
  fileUrl: string;
}
