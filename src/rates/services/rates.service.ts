import {
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CryptoRate } from '../schemas/crypto_rate_schema';
import { WhiteList } from '../schemas/whitelist_schema';
import { BinanceService } from './binance.service';
import { UniswapService } from './uniswap.service';
import { ConfigService } from '@nestjs/config';
import { GetHistoryRatesDto } from '../dto/getHistoryRates.dto';
import { RatesDto } from '../dto/rates.dto';
import { RateDto } from '../dto/rate.dto';
import { GetRateDto } from '../dto/getRate.dto';

@Injectable()
export class RatesService {
  constructor(
    @Inject('CRYPTO_RATE_MODEL') private cryptoRateModel: Model<CryptoRate>,
    @Inject('WHITELIST_MODEL') private whiteListModel: Model<WhiteList>,
    private readonly binanceService: BinanceService,
    private readonly uniswapService: UniswapService,
    private readonly configService: ConfigService,
  ) {}

  async getRate(data: GetRateDto): Promise<RateDto> {
    const query: any = {
      symbolA: data.symbolA,
      symbolB: data.symbolB,
    };

    const rate = await this.cryptoRateModel
      .findOne(query)
      .sort([['timestamp', -1]]);

    if (!rate) {
      throw new UnprocessableEntityException({
        message: 'Rate record not found',
        errorCode: 'RECORD_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return new RateDto(rate);
  }

  async getHistoryRates(data: GetHistoryRatesDto): Promise<RatesDto> {
    const query: any = {
      symbolA: data.symbolA,
      symbolB: data.symbolB,
    };

    if (data.fromTimestamp || data.toTimestamp) {
      query.timestamp = {};
      if (data.fromTimestamp) {
        query.timestamp.$gte = data.fromTimestamp;
      }
      if (data.toTimestamp) {
        query.timestamp.$lte = data.toTimestamp;
      }
    }

    const list = await this.cryptoRateModel.find(query);

    return new RatesDto(list);
  }

  async collectRates(): Promise<void> {
    const factoryAddress = this.configService.get<string>(
      'UNISWAP_FACTORY_CONTRACT',
    );

    const whitelist = await this.whiteListModel.find();

    for (const pair of whitelist) {
      const { symbol: binancePair, price: binanceRate } =
        await this.binanceService.getBinanceRate(pair.symbolA, pair.symbolB);

      const { pairAddress, price: uniRate } =
        await this.uniswapService.getUniswapRate(
          pair.addressA,
          pair.addressB,
          factoryAddress,
        );

      const rate = {
        symbolA: pair.symbolA,
        symbolB: pair.symbolB,
        binancePair,
        pairAddressUni: pairAddress,
        timestamp: Date.now(),
        rate: binanceRate,
        isCorrect: Math.abs((binanceRate - uniRate) / binanceRate) <= 0.1,
      };

      const cryptoRate = new this.cryptoRateModel(rate);
      await cryptoRate.save();
    }
  }

  // async initWhiteList() {
  //   await this.whiteListModel.insertMany(whitelist);
  // }
}

// const whitelist = [
//   {
//     symbolA: 'BNB',
//     symbolB: 'BTC',
//     addressA: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//     addressB: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   },
//   {
//     symbolA: 'ETH',
//     symbolB: 'BTC',
//     addressA: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
//     addressB: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   },
//   {
//     symbolA: 'GALA',
//     symbolB: 'BNB',
//     addressA: '0x347E430b7Cd1235E216be58ffA13394e5009E6e2',
//     addressB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//   },
//   {
//     symbolA: 'DOGE',
//     symbolB: 'BNB',
//     addressA: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
//     addressB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//   },
//   {
//     symbolA: 'BNB',
//     symbolB: 'ETH',
//     addressA: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//     addressB: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
//   },
//   {
//     symbolA: 'TON',
//     symbolB: 'USDT',
//     addressA: '0x76A797A59Ba2C17726896976B7B3747BfD1d220f',
//     addressB: '0x55d398326f99059fF775485246999027B3197955',
//   },
// ];
