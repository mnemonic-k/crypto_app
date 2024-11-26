import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (
      configService: ConfigService,
    ): Promise<mongoose.Mongoose> => {
      const MONGODB_CONNECTION_URI = configService.get<string>(
        'MONGODB_CONNECTION_URI',
      );

      return await mongoose.connect(MONGODB_CONNECTION_URI);
    },

    inject: [ConfigService],
  },
];
