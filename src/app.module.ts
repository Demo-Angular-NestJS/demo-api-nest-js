import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IdempotencyInterceptor, JwtAuthGuard, RefreshSessionInterceptor } from 'common';
import { DatabaseModule } from 'database';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { SharedModule } from 'share.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    // 1. Setup Config with Global access
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Async Mongoose Setup
    DatabaseModule,

    CacheModule.register({
      isGlobal: true,
      // No 'store' specified means it defaults to in-memory (lru-cache)
      ttl: 86400000, // 24 hours in milliseconds
      max: 1000,     // Maximum number of items in cache (prevent memory leaks)
    }),

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
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
  ],
})
export class AppModule { }
