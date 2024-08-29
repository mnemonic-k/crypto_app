import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RatesService } from './services/rates.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmptyDto } from 'src/common/empty.dto';
import { GetHistoryRatesDto } from './dto/getHistoryRates.dto';
import { RatesDto } from './dto/rates.dto';
import { GetRateDto } from './dto/getRate.dto';
import { RateDto } from './dto/rate.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('crypto_rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @ApiResponse({ type: () => RateDto })
  @ApiOperation({
    summary: 'Get rate',
  })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getRate(@Query() query: GetRateDto): Promise<RateDto> {
    return this.ratesService.getRate(query);
  }

  @ApiResponse({ type: () => RatesDto })
  @ApiOperation({
    summary: 'Get history rates',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 5000 } })
  @Get('history')
  async getHistoryRates(@Query() query: GetHistoryRatesDto): Promise<RatesDto> {
    return this.ratesService.getHistoryRates(query);
  }

  @ApiResponse({ type: () => EmptyDto })
  @ApiOperation({
    summary: 'Collect crypto rates data based on whitelist collection',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/collect')
  async collectRates(): Promise<void> {
    await this.ratesService.collectRates();
  }
}
