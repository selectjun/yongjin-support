import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PasswordEncoder } from 'src/utils/password-encoder.util';

/**
 * 인증 Service
 */
@Injectable()
export class AuthService {
  /**
   * 생성자
   * @param userService 사용자 Service
   * @param jwtService JWT Service
   */
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private passwordEncoder: PasswordEncoder,
  ) {}

  /**
   * 로그인 검증
   * @param username 사용자 아이디
   * @param pass 사용자 비밀번호
   * @returns 로그인 검증 결과
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUser(username);
    if (user && this.passwordEncoder.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 로그인
   * @param user 사용자 정보
   * @returns 로그인 정보
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 토큰 업데이트
   * @param token 토큰
   * @returns 새 토큰
   */
  async refreshToken(token: string) {
    const { username, sub } = this.jwtService.decode(token) as unknown as {
      username: string;
      sub: string;
    };

    const payload = { username, sub };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
