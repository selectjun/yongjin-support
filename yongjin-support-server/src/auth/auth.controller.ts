import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

/**
 * 인증 Controller
 */
@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  /**
   * 생성자
   * @param authService 인증 Service
   */
  constructor(private authService: AuthService) {}

  /**
   * 로그인
   * @param req 요청 객체
   * @returns 로그인 정보
   */
  @ApiCreatedResponse({
    description: '로그인에 성공하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인에 실패하였습니다.',
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    console.log(req);
    const user = await this.authService.login(req.user);
    const { password, ...result } = user;

    return result;
  }

  /**
   * 토큰 업데이트
   * @param headers 헤더
   * @returns 토큰
   */
  @ApiCreatedResponse({
    description: '토큰 갱신에 성공하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '토큰 갱신에 실패하였습니다.',
  })
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
