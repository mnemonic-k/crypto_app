import { Mongoose } from 'mongoose';
import { CryptoRateSchema } from './schemas/crypto_rate_schema';
import { WhiteListSchema } from './schemas/whitelist_schema';

export const ratesModelsProviders = [
  {
    provide: 'CRYPTO_RATE_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('CryptoRate', CryptoRateSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'WHITELIST_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Whitelist', WhiteListSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
