import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ExportProtoClientType } from '../types/export.proto.types';

const PROTO_PATH = path.resolve(__dirname, '../../proto/export.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ExportProtoClientType;

export const exportClient = new protoDescriptor.export.ExportService(
  process.env.EXPORT_GRPC_URL || 'localhost:4040',
  grpc.credentials.createInsecure()
);
