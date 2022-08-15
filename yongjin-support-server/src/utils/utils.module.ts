import { Module } from '@nestjs/common';
import { PasswordEncoder } from './password-encoder.util';

/**
 * 유틸 모듈
 */
@Module({
  providers: [PasswordEncoder],
  exports: [PasswordEncoder],
})
export class UtilsModule {}
