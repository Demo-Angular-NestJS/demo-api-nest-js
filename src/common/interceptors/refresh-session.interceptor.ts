import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { StringValue } from 'ms';
import { JWTTokenDTO } from 'common/models';

@Injectable()
export class RefreshSessionInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const user: JWTTokenDTO = request.user;

    return next.handle().pipe(
      tap(() => {
        // Only slide the session if the user is authenticated
        if (user && user.exp) {
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = (user.exp - now);
          const tokeLifeTime = +(process.env.COOKIE_LIFE_TIME_MS || '300000');

          if (timeLeft < ((tokeLifeTime / 2) / 1000)) {
            const token = {
              userName: user.userName,
              email: user.email,
              sub: user.sub,
            };
            const newAccessToken = this.jwtService.sign(token, {
              secret: process.env.JWT_ACCESS_SECRET,
              expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as StringValue | number,
            });

            response.cookie((process.env.COOKIE_NAME || 'cn'), newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: tokeLifeTime,
            });
          }
        }
      }),
    );
  }
}