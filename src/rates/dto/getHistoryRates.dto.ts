import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GetRateDto } from './getRate.dto';

export class GetHistoryRatesDto extends GetRateDto {
  @ApiProperty({ type: () => Date, required: false })
  @IsOptional()
  fromTimestamp: Date;

  @ApiProperty({ type: () => Date, required: false })
  @IsOptional()
  toTimestamp: Date;
}
