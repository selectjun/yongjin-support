import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 사용자 Schema Type
 */
export type UserDocument = User & Document;

/**
 * 사용자 Schema
 */
@Schema()
export class User {
  /**
   * 아이디
   */
  @Prop({ type: String, required: true })
  username: string;

  /**
   * 비밀번호
   */
  @Prop({ type: String, required: true })
  password: string;

  /**
   * 닉네임
   */
  @Prop({ type: String, required: true })
  nickname: string;

  /**
   * 활성화 여부
   */
  @Prop({ type: Boolean, default: true })
  is_activate: boolean;

  /**
   * 탈퇴 일시
   */
  @Prop({ type: Date, default: null })
  withdrawal_date: Date;

  /**
   * 생성일시
   */
  @Prop({ type: Date, required: true })
  created_at: Date;

  /**
   * 수정일시
   */
  @Prop({ type: Date, required: true })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
