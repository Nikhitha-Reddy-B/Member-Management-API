import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import dotenv from 'dotenv';
import sequelize from '../../src/config/db'; 
import { handleExportExcel } from './service/export.service';
import { ExportServiceHandlers } from './types/export.proto.types';
import { ExportProtoType } from './types/export.proto.types';

dotenv.config(); 

const PROTO_PATH = path.resolve(__dirname, '../../proto/export.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ExportProtoType;

const server = new grpc.Server();


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Export server DB connection successful!');
  } catch (error) {
    console.error('Export server DB connection failed:', error);
    process.exit(1);
  }

  server.addService(protoDescriptor.export.ExportService.service, {
    ExportExcel: handleExportExcel,
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
