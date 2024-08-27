import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetRateDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  symbolA: string;

  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  symbolB: string;
}
