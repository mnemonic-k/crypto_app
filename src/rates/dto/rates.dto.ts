import { ApiProperty } from '@nestjs/swagger';
import { RateDto } from './rate.dto';

export class RatesDto {
  constructor(historyRates: any[]) {
    this.data = historyRates?.map((obj) => new RateDto(obj)) || [];
  }

  @ApiProperty({ type: () => [RateDto], required: true })
  data: RateDto[];
}
