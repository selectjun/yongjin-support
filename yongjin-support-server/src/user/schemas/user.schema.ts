import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  nickname: string;

  @Prop({ type: Date, required: true })
  created_at: Date;

  @Prop({ type: Date, required: true })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
