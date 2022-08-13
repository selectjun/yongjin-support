import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * 비밀번호 암호화 유틸
 */
@Injectable()
export class PasswordEncoder {
  /**
   * saltOrRounds
   */
  private saltOrRounds = 10;

  /**
   * 비밀번호 암호화
   * @param rawPassword 원본 비밀번호
   */
  encode(rawPassword: string): string {
    return bcrypt.hashSync(rawPassword, this.saltOrRounds);
  }

  /**
   * 비밀번호 일치 여부 확인
   * @param rawPassword 원본 비밀번호
   * @param encodedPassword 암호화된 비밀번호
   */
  compare(rawPassword: string, encodedPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, encodedPassword);
  }
}
