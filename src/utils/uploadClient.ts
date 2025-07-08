import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { UploadProtoClientType } from '../types/upload.proto.types';

const PROTO_PATH = path.resolve(__dirname, '../../proto/upload.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as UploadProtoClientType;

console.log("Loaded methods from proto:", Object.keys(protoDescriptor.upload.UploadService.service));

export const uploadClient = new protoDescriptor.upload.UploadService(
  process.env.EXPORT_GRPC_URL || 'localhost:4040',
  grpc.credentials.createInsecure()
);
