import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  username: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '최소 8 자, 하나 이상의 대문자, 하나의 소문자 및 하나의 숫자를 입력해주세요.',
  })
  password: string;

  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;
}
