import { Injectable } from '@nestjs/common';
import { Spot } from '@binance/connector-typescript';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BinanceService {
  client: Spot;

  constructor(private readonly configService: ConfigService) {
    const API_KEY = this.configService.get<string>('BINANCE_API_KEY');
    const API_SECRET = this.configService.get<string>('BINANCE_API_SECRET');
    const BASE_URL = this.configService.get<string>('BINANCE_API_BASE_URL');

    this.client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });
  }

  async getBinanceRate(symbolA: string, symbolB: string): Promise<any> {
    const binancePair = `${symbolA}${symbolB}`;
    let res;

    try {
      res = await this.client.symbolPriceTicker({ symbol: binancePair });
    } catch (err) {
      console.log(binancePair, err);
    }

    return res;
  }
}
