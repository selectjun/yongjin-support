import { IsNotEmpty, Matches } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;
}
