import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

/**
 * 설정 검증 규칙
 */
class EnvironmentVariables {
  @IsString()
  MONGO_URL: string;

  @IsString()
  JWT_SECRET: string;
}

/**
 * 설정 파일 검증
 * @param config 설정
 * @returns 설정
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
