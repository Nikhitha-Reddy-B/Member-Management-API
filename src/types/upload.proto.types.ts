import { ServerUnaryCall, sendUnaryData, ServiceDefinition } from '@grpc/grpc-js';
import { UploadExcelRequest, UploadExcelResponse } from './upload.types';

export interface UploadServiceHandlers {
  UploadExcel: (
    call: ServerUnaryCall<UploadExcelRequest, UploadExcelResponse>,
    callback: sendUnaryData<UploadExcelResponse>
  ) => void;
}

export interface UploadProtoServerType {
  upload: {
    UploadService: {
      service: ServiceDefinition<UploadServiceHandlers>;
    };
  };
}

export interface UploadProtoClientType {
  upload: {
    UploadService: import('@grpc/grpc-js').ServiceClientConstructor;
  };
}
