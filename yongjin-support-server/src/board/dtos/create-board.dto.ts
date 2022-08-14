import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * 게시물 생성 Dto
 */
export class CreateBoardDto {
  /**
   * 제목
   */
  @ApiProperty({
    description: '제목',
    type: String,
  })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  /**
   * 내용
   */
  @ApiProperty({
    description: '내용',
    type: String,
  })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  /**
   * 첨부파일
   */
  @ApiProperty({
    description: '첨부파일',
    required: false,
  })
  @Optional()
  attachments: Express.Multer.File;
}
