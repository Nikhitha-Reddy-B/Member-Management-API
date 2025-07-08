import { ServerUnaryCall, sendUnaryData, ServiceDefinition } from '@grpc/grpc-js';
import { UploadTaskExcelRequest, UploadTaskExcelResponse } from './upload.types';

export interface UploadTaskServiceHandlers {
  UploadTaskExcel: (
    call: ServerUnaryCall<UploadTaskExcelRequest, UploadTaskExcelResponse>,
    callback: sendUnaryData<UploadTaskExcelResponse>
  ) => void;
}

export interface UploadTaskProtoServerType {
  uploadTask: {
    UploadTaskService: {
      service: ServiceDefinition<UploadTaskServiceHandlers>;
    };
  };
}
