import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * 로그인 Dto
 */
export class LoginDto {
  /**
   * 아이디
   */
  @ApiProperty({
    description: '아이디',
    type: String,
  })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  username: string;

  /**
   * 비밀번호
   */
  @ApiProperty({
    description: '비밀번호',
    type: String,
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
