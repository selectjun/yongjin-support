import {
  Controller,
  Header,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

/**
 * 인증 Controller
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * 인증 Service
   */
  constructor(private authService: AuthService) {}

  /**
   * 로그인
   * @param req 요청 객체
   * @returns 로그인 정보
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = await this.authService.login(req.user);
    const { password, ...result } = user;

    return result;
  }

  /**
   * 토큰 업데이트
   * @param headers 헤더
   * @returns 토큰
   */
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Headers() headers: any) {
    const { authorization } = headers;

    const nextToken = await this.authService.refreshToken(
      authorization.replace(/Bearer /, ''),
    );

    return nextToken;
  }
}
