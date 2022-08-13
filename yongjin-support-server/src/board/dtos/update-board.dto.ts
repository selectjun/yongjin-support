import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({
    description: '제목',
    type: String,
  })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @ApiProperty({
    description: '내용',
    type: String,
  })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;
}