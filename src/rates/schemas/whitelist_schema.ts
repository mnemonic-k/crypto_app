import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WhitelistDocument = HydratedDocument<WhiteList>;

@Schema()
export class WhiteList {
  @Prop({ required: true })
  symbolA: string;

  @Prop({ required: true })
  symbolB: string;

  @Prop({ required: true })
  addressA: string;

  @Prop({ required: true })
  addressB: string;
}

export const WhiteListSchema = SchemaFactory.createForClass(WhiteList);
