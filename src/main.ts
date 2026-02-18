import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CSRFExceptionFilter, doubleCsrfProtection } from 'common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api'); // Set the prefix for all routes defined in the application
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Automatically adds /v1/ to all routes
  });
  
  //#region CORS Config
  const origin = configService.get<string>('URL_ALLOWED_ACCESS');

  app.enableCors({
    origin: origin?.includes(',') ? origin.split(',') : origin || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Idempotency-Key', 'x-csrf-token'],
    exposedHeaders: ['X-Total-Count'],
  });
  //#endregion

  //#region COOKIES AND CSRF Config
  app.use(cookieParser(process.env.COOKIE_PARSER_SECRET)); // Essential for reading cookies
  app.use(doubleCsrfProtection);
  app.useGlobalFilters(new CSRFExceptionFilter());
  //#endregion

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll', 
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Automatically remove properties that do not have any decorators in the DTO
      forbidNonWhitelisted: false, // Stops NestJS from throwing an error when extra properties are found.
      transform: true, // Automatically transforms payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Helps with DTOs converstion
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
