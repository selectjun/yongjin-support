import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 서버 에러
 */
export class InternalServerErrorException extends HttpException {
  /**
   * 생성자
   * @param message 메시지
   */
  constructor(message: string) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
