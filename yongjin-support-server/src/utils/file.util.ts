import { Injectable } from '@nestjs/common';
import { Attachments } from 'src/common/subschemas/attachments.subschema';

@Injectable()
export class FileUtil {
  getPhigicalFileFormat(file: Express.Multer.File): Attachments {
    if (!file) return null;

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
