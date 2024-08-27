import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CryptoRateDocument = HydratedDocument<CryptoRate>;

@Schema()
export class CryptoRate {
  @Prop({ required: true })
  symbolA: string;

  @Prop({ required: true })
  symbolB: string;

  @Prop({ required: true })
  binancePair: string;

  @Prop({ required: true })
  pairAddressUni: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const CryptoRateSchema = SchemaFactory.createForClass(CryptoRate);
