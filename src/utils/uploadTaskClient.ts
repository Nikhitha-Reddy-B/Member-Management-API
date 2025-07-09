import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { UploadTaskProtoClientType } from '../types/uploadTask.proto.types';

const PROTO_PATH = path.resolve(__dirname, '../../proto/uploadTask.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as UploadTaskProtoClientType;

console.log("Loaded UploadTaskService client methods:", Object.keys(protoDescriptor.uploadTask.UploadTaskService.prototype));

export const uploadTaskClient = new protoDescriptor.uploadTask.UploadTaskService(
  process.env.EXPORT_GRPC_URL || 'localhost:4040',
  grpc.credentials.createInsecure()
);
