import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 3000);
  const options = new DocumentBuilder()
    .setTitle('Shorten URL API')
    .setDescription('The Shorten URL API documentation')
    .setVersion('1.0')
    .addTag('shorten-url')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
bootstrap();
