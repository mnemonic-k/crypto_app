import { ApiProperty } from '@nestjs/swagger';

export class RateDto {
  constructor(cryptoRate: any) {
    this.timestamp = cryptoRate.timestamp.getTime();
    this.rate = cryptoRate.rate;
  }

  @ApiProperty({ type: () => Number, required: true })
  timestamp: number;

  @ApiProperty({ type: () => Number, required: true })
  rate: number;
}
