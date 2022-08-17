import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 파일 이름 미존재 에러
 */
export class FileOriginalNameEmptyException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '파일 이름(originalName)이 지정되지 않았습니다.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
