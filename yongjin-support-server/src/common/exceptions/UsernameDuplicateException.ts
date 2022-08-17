import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Username 중복 에러
 */
export class UsernameDuplicateException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message: '사용자 아이디가 존재합니다.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
