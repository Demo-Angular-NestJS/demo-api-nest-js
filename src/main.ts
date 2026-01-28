import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set the prefix for all routes defined in the application
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Automatically adds /v1/ to all routes
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that don't exist in the DTO
      forbidNonWhitelisted: true, // Throws error if unknown properties are sent
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), {
    strategy: 'excludeAll', // Only if you want strict mode app-wide
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
