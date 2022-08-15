import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 첨부파일 Subschema Type
 */
export type AttachmentsDocument = Attachments & Document;

/**
 * 첨부파일
 */
@Schema({
  _id: false,
})
export class Attachments {
  /**
   * 원본 파일 이름
   */
  @Prop({ type: String, required: true })
  originalName: string;

  /**
   * 마임 타입
   */
  @Prop({ type: String, required: true })
  mimeType: string;

  /**
   * 논리 파일 이름
   */
  @Prop({ type: String, required: true })
  fileName: string;

  /**
   * 파일 사이즈
   */
  @Prop({ type: Number, required: true })
  size: number;
}

/**
 * 첨부파일 Schema
 */
export const AttachmentsSubchema = SchemaFactory.createForClass(Attachments);
