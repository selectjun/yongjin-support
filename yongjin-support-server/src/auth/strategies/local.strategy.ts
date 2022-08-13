import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Local Strategy
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * 생성자
   * @param authService 인증 Service
   */
  constructor(private authService: AuthService) {
    super();
  }

  /**
   *
   * @param username 사용자 아이디
   * @param password 사용자 비밀번호
   * @returns 사용자 데이터
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
