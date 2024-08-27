import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  convertBigIntToFloat(bigIntValue: bigint, decimalPlaces: number): number {
    const scaleFactor = 10 ** decimalPlaces;
    const floatValue = Number(bigIntValue) / scaleFactor;

    return floatValue;
  }
}
