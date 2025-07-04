import { ServerUnaryCall, sendUnaryData, ServiceDefinition } from '@grpc/grpc-js';
import { ExportExcelRequest, ExportExcelResponse } from './export.types';

export interface ExportServiceHandlers {
  ExportExcel: (
    call: ServerUnaryCall<ExportExcelRequest, ExportExcelResponse>,
    callback: sendUnaryData<ExportExcelResponse>
  ) => void;
}

export interface ExportProtoServerType {
  export: {
    ExportService: {
      service: ServiceDefinition<ExportServiceHandlers>;
    };
  };
}

export interface ExportProtoClientType {
  export: {
    ExportService: import('@grpc/grpc-js').ServiceClientConstructor;
  };
}
