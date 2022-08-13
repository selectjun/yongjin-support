import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

/**
 * 사용자 Controller
 */
@ApiTags('user')
@Controller('user')
export class UserController {
  /**
   * 생성자
   * @param userService 사용자 Service
   */
  constructor(private userService: UserService) {}

  /**
   * 사용자 생성
   * @param createUserDto 사용자 생성 데이터
   * @returns 사용자 정보
   */
  @ApiCreatedResponse({
    description: '사용자가 생성되었습니다.',
  })
  @ApiBadRequestResponse({
    description: '요청 데이터가 누락되었습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @ApiBody({ type: CreateUserDto })
  @Post('')
  async createUser(@Body() createUserDto: CreateUserDto) {
    // 회원 중복 확인
    const isExistUser = await this.userService.isExistUser(
      createUserDto.username,
    );
    if (isExistUser) {
      throw new HttpException(
        '사용자 아이디가 존재합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.createUser(createUserDto);

    return user;
  }

  @ApiOkResponse({
    description: '사용자를 조회하였습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '권한이 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '알 수 없는 에러가 발생하였습니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUser(@Request() req) {
    return req.user;
  }
}
