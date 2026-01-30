import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token; // 'refresh_token' is our cookie name
        },
      ]),
      secretOrKey: `${process.env.JWT_REFRESH_SECRET}`, // Use environment variables in production,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh_token;
    return { ...payload, refreshToken };
  }
}