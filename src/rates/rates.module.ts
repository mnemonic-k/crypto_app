import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './services/rates.service';
import { BinanceService } from './services/binance.service';
import { UniswapService } from './services/uniswap.service';
import { DatabaseModule } from 'src/common/database.module';
import { ratesModelsProviders } from 'src/common/database.models';

@Module({
  imports: [DatabaseModule],
  controllers: [RatesController],
  providers: [
    ...ratesModelsProviders,
    RatesService,
    BinanceService,
    UniswapService,
  ],
})
export class RatesModule {}
