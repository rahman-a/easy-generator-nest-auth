import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './auth.schema';

@Schema({ timestamps: true })
export class RefreshToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  expiryAt: Date;
}

export const refreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
