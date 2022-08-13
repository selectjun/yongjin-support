import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '아이디',
    type: String,
  })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  username: string;

  @ApiProperty({
    description: '비밀번호',
    type: String,
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '최소 8 자, 하나 이상의 대문자, 하나의 소문자 및 하나의 숫자를 입력해주세요.',
  })
  password: string;

  @ApiProperty({
    description: '닉네임',
    type: String,
  })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;
}
