import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성 검증 설정
  app.useGlobalPipes(new ValidationPipe());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Yongjin API')
    .setDescription('The yongjin API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('user')
    .addTag('board')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(3000);
}
bootstrap();
