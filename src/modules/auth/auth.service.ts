import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/user.repository';
import type { Response } from 'express';
import { LoginRequestDTO } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

  /**
   * Validate user and return a signed JWT string
   */
  async login(loginRequestDTO: LoginRequestDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginRequestDTO;

    // 1. Fetch user from MongoDB
    const user = await this.userRepository.findOne({ email, password });

    // Nota: Deberías usar bcrypt.compare aquí
    // (await bcrypt.compare(password, user.password))
    if (user) {
      const payload = {
        username: user.userName,
        email: user.email,
        sub: user._id,
      };

      // Firmar Access Token
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      });

      // Firmar Refresh Token
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30m',
      });

      return { accessToken, refreshToken };
    }

    throw new UnauthorizedException('Invalid username or password');
  }

  async refreshTokens(userId: string, res: Response) {
    const accessToken = this.jwtService.sign({ sub: userId }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m'
    });

    const newRefreshToken = this.jwtService.sign({ sub: userId }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30m'
    });

    // Set the cookie on the response
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { access_token: accessToken };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });

    if (user && (await bcrypt.compare(pass, user?.password ?? ''))) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }
}
