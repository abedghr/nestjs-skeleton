import { NestApplication, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import swaggerInit from './swagger';


async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  const configService = app.get(ConfigService);
  const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');
  const globalPrefix: string = configService.get<string>('app.globalPrefix');
  const versioningPrefix: string = configService.get<string>(
    'app.versioning.prefix',
  );
  const version: string = configService.get<string>('app.versioning.version');

  // enable
  const versionEnable: string = configService.get<string>(
    'app.versioning.enable',
  );
  app.setGlobalPrefix(globalPrefix);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // Versioning
  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
      prefix: versioningPrefix,
    });
  }

  // Swagger
  await swaggerInit(app);
  // Global Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  // Listen
  await app.listen(port, host);
}
bootstrap();
