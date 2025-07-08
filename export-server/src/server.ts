import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import dotenv from 'dotenv';
import sequelize from '../../src/config/db';
import { handleExportExcel } from './service/export.service';
import { handleUploadExcel } from './service/upload.service';
import { ExportProtoServerType } from './types/export.proto.types';
import { UploadProtoServerType } from './types/upload.proto.types';

dotenv.config();

const EXPORT_PROTO_PATH = path.resolve(__dirname, '../../proto/export.proto');
const exportPackageDef = protoLoader.loadSync(EXPORT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const exportProtoDescriptor = grpc.loadPackageDefinition(exportPackageDef) as unknown as ExportProtoServerType;

const UPLOAD_PROTO_PATH = path.resolve(__dirname, '../../proto/upload.proto');
const uploadPackageDef = protoLoader.loadSync(UPLOAD_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const uploadProtoDescriptor = grpc.loadPackageDefinition(uploadPackageDef) as unknown as UploadProtoServerType;

const server = new grpc.Server();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Export server DB connection successful!');
  } catch (error) {
    console.error('Export server DB connection failed:', error);
    process.exit(1);
  }

  console.log('Registering service methods: ExportExcel (export.proto), UploadExcel (upload.proto)');

  server.addService(exportProtoDescriptor.export.ExportService.service, {
    ExportExcel: handleExportExcel,
  });

  server.addService(uploadProtoDescriptor.upload.UploadService.service, {
    UploadExcel: handleUploadExcel,
  });

  const PORT = process.env.EXPORT_GRPC_PORT || '4040';
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to start gRPC server:', err);
      return;
    }
    console.log(`Export gRPC server running at 0.0.0.0:${port}`);
  });
})();
