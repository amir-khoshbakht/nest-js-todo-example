

import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['error', 'warn'],
  });
  const configurationService = app.get<ConfigService>(ConfigService);
  const appPort = configurationService.getOrThrow('APP.PORT');
  const appName = configurationService.getOrThrow('APP.NAME');
  const appDescription = configurationService.getOrThrow('APP.DESCRIPTION');
  const appVersion = configurationService.getOrThrow('APP.VERSION');
  const appLicense = configurationService.getOrThrow('APP.APP_LICENSE');
  const appLicenseUrl = configurationService.getOrThrow('APP.APP_LICENSE_URL');
  const appApiPrefix = configurationService.getOrThrow('APP.API_PREFIX');
  const appSwaggerPath = configurationService.getOrThrow('APP.SWAGGER_PATH');

  const swaggerFullPath = `${appApiPrefix}/${appSwaggerPath}`;

  app.setGlobalPrefix(appApiPrefix);

  // Setup Swagger Api
  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .setContact('contact', 'www.w.w', 'email@email.email')
    .setLicense(appLicense, appLicenseUrl)
    // .setExternalDoc('documentation path','')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerFullPath, app, document);

  // Register Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(appPort, () => {
    {
      Logger.log(
        `Swagger path (WEB): http://localhost:${appPort}/${swaggerFullPath}`,
      );
      Logger.log(
        `Swagger path (JSON): http://localhost:${appPort}/${swaggerFullPath}-json`,
      );
      // wait for the application to bootstrap!
    }
  });
}
bootstrap();
