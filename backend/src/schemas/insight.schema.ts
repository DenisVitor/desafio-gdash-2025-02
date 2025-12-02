import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InsightDocument = Insight & Document;

@Schema({ timestamps: true })
export class Insight {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['info', 'warning', 'danger'], default: 'info' })
  severity: 'info' | 'warning' | 'danger';
}

export const InsightSchema = SchemaFactory.createForClass(Insight);
