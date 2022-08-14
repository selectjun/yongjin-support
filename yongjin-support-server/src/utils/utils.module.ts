import { Module } from '@nestjs/common';
import { FileUtil } from './file.util';
import { PasswordEncoder } from './password-encoder.util';

/**
 * 유틸 모듈
 */
@Module({
  providers: [PasswordEncoder, FileUtil],
  exports: [PasswordEncoder, FileUtil],
})
export class UtilsModule {}
