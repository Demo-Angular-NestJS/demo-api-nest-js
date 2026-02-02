import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard, RefreshSessionInterceptor } from 'common';
import { DatabaseModule } from 'database';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { SharedModule } from 'share.module';

@Module({
  imports: [
    // 1. Setup Config with Global access
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Async Mongoose Setup
    DatabaseModule,
    SharedModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RefreshSessionInterceptor, // Extends session for all routes
    },
  ],
})
export class AppModule {}
