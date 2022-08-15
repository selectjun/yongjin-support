import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':dest/:fileName')
  getFile(
    @Res() res: Response,
    @Param('dest') dest: string,
    @Param('fileName') fileName: string,
    @Query('originalName') originalName: string,
  ) {
    if (!originalName) res.end();

    const physicalPath = this.fileService.getDownloadUrl(dest, fileName);

    res.download(physicalPath, originalName);
  }
}
