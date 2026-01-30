import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token; // 'access_token' is our cookie name
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_ACCESS_SECRET}`, // Use environment variables in production
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}