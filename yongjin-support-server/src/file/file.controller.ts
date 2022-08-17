import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileOriginalNameEmptyException } from 'src/common/exceptions/FileOriginalNameEmptyException';
import { InternalServerErrorException } from 'src/common/exceptions/InternalServerErrorException';
import { FileService } from './file.service';

/**
 * 파일 Controller
 */
@Controller('file')
export class FileController {
  /**
   * 생성자
   * @param fileService 파일 Service
   */
  constructor(private fileService: FileService) {}

  /**
   * 파일 다운로드
   * @param res 응답 객체
   * @param dest Prefix
   * @param fileName 파일 저장 이름
   * @param originalName 파일 원본 이름
   */
  @Get(':dest/:fileName')
  getFile(
    @Res() res: Response,
    @Param('dest') dest: string,
    @Param('fileName') fileName: string,
    @Query('originalName') originalName: string,
  ) {
    try {
      if (!originalName) throw new FileOriginalNameEmptyException();

      const physicalPath = this.fileService.getDownloadPath(dest, fileName);

      res.download(physicalPath, originalName);
    } catch (e) {
      const isFileOriginalNameEmptyException = e
        .toString()
        .includes('FileOriginalNameEmptyException');
      if (isFileOriginalNameEmptyException) {
        throw e;
      } else {
        throw new InternalServerErrorException(
          '알 수 없는 에러가 발생하였습니다.',
        );
      }
    }
  }
}
