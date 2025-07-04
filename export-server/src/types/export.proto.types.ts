import { ServerUnaryCall, sendUnaryData, ServiceDefinition } from '@grpc/grpc-js';
import { ExportExcelRequest, ExportExcelResponse } from './export.types';

export interface ExportServiceHandlers {
  ExportExcel: (
    call: ServerUnaryCall<ExportExcelRequest, ExportExcelResponse>,
    callback: sendUnaryData<ExportExcelResponse>
  ) => void;
}

export interface ExportProtoType {
  export: {
    ExportService: {
      service: ServiceDefinition<ExportServiceHandlers>;
    };
  };
}
