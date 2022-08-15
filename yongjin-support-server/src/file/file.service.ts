import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Attachments } from 'src/common/subschemas/attachments.subschema';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

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

  getDownloadUrl(dest: string, fileName: string): string {
    return `${this.configService.get<string>(
      'UPLOAD_BASIC_DIRECTORY',
    )}/${dest}/${fileName}`;
  }
}
