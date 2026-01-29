import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

  /**
   * Validate user and return a signed JWT string
   */
  async login(loginDto: any): Promise<string> {
    const { userName, password } = loginDto;

    // 1. Fetch user from MongoDB
    const user = await this.userRepository.findOne({ userName, password });

    // 2. Compare passwords (plain text vs hashed)
    if (user && (await bcrypt.compare(password, user?.password ?? ''))) {
      // 3. Create JWT payload
      const payload = { username: user.userName, sub: user._id };

      // 4. Return signed token
      return this.jwtService.sign(payload);
    }

    throw new UnauthorizedException('Invalid username or password');
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
