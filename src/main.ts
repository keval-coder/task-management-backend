import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorLogger } from './utils/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ErrorLogger(),
  });

  // SWAGGER SETUP
  const config = new DocumentBuilder()
    .setTitle('Task Management Backend')
    .setDescription('Personal Project')
    .setVersion('1.0')
    .addTag('Management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-test', app, document);

  await app.listen(3000);
}
bootstrap();
