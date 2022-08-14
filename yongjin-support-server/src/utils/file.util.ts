import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUtil {
  getPhigicalFileFormat(file: Express.Multer.File) {
    if (!file) return null;
    console.log(file);

    const { originalname, mimetype, filename, size } = file;
    const ext = originalname.split('.').pop();

    return {
      originalName: originalname,
      mimeType: mimetype,
      fileName: filename + '.' + ext,
      size,
    };
  }
}
