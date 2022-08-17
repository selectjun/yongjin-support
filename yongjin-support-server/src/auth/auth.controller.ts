import {
  Body,
  Controller,
  Headers,
  HttpStatus,
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
import { InternalServerErrorException } from 'src/common/exceptions/InternalServerErrorException';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

/**
 * 인증 Controller
 */
@ApiTags('auth')
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
    try {
      const user = await this.authService.login(req.user);
      const { password, ...result } = user;

      return {
        data: { user: result },
        status: HttpStatus.CREATED,
        message: '로그인에 성공하였습니다',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
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
    try {
      const { authorization } = headers;

      const nextToken = await this.authService.refreshToken(
        authorization.replace(/Bearer /, ''),
      );

      return {
        data: nextToken,
        status: HttpStatus.CREATED,
        message: '토근 갱신에 성공하였습니다.',
      };
    } catch (e) {
      throw new InternalServerErrorException(
        '알 수 없는 에러가 발생하였습니다.',
      );
    }
  }
}
