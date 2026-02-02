import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWTTokenDTO } from 'common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies[(process.env.COOKIE_NAME || 'cn')];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_ACCESS_SECRET}`, // Use environment variables in production
    });
  }

  async validate(payload: JWTTokenDTO) {
    return payload;
  }
}