import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

/**
 * 게시판 Schema Type
 */
export type BoardDocument = Board & Document;

/**
 * 게시판 Schema
 */
@Schema()
export class Board {
  /**
   * 아이디
   */
  @Prop({ type: String, required: true })
  title: string;

  /**
   * 비밀번호
   */
  @Prop({ type: String, required: true })
  content: string;

  /**
   * 활성화 여부
   */
  @Prop({ type: Boolean, default: true })
  is_activate: boolean;

  /**
   * 생성자
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  created_by: User;

  /**
   * 수정자
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  updated_by: User;

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

export const BoardSchema = SchemaFactory.createForClass(Board);
