import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api'); // Set the prefix for all routes defined in the application
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Automatically adds /v1/ to all routes
  });
  app.use(cookieParser()); // Essential for reading cookies

  //#region CORS Config
  const origin = configService.get<string>('URL_ALLOWED_ACCESS');

  app.enableCors({
    origin: origin?.includes(',') ? origin.split(',') : origin || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  //#endregion

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll', 
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that don't exist in the DTO
      forbidNonWhitelisted: true, // Throws error if unknown properties are sent
      transform: true, // Automatically transforms payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Helps with DTOs converstion
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
