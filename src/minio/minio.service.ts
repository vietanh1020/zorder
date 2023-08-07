import * as Minio from 'minio';

import { ConfigService } from '@nestjs/config';

export type MinioClient = Minio.Client;

export const MinioService = {
  provide: 'MINIO',
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<MinioClient> => {
    return new Minio.Client({
      endPoint: config.get('MINIO_ENDPOINT'),
      port: parseInt(config.get('MINIO_PORT')),
      useSSL: config.get('MINIO_SSL') == 'true',
      accessKey: config.get('MINIO_ACCESS_KEY'),
      secretKey: config.get('MINIO_SECRET_KEY'),
    });
  },
};
