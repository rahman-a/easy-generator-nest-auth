import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { isPasswordMatch, validateEmail } from 'src/utils';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, min: 3 })
  name: string;

  @Prop({
    required: [true, 'Email Address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please enter a valid email'],
  })
  email: string;

  @Prop({
    required: [true, 'password is required'],
    trim: true,
    validate: [isPasswordMatch, 'Please enter a valid password'],
  })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
