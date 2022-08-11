import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

/**
 * 사용자 Controller
 */
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
  @Post()
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

    // TODO: 비밀번호 암호화

    const user = await this.userService.createUser(createUserDto);

    return user;
  }
}
