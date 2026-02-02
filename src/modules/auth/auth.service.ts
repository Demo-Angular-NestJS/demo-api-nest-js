import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { UserRepository } from 'modules/user/user.repository';
import { BCryptService } from 'common';
import { LoginRequestDTO } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,    
    private bcryptService: BCryptService,
  ) { }

  async login(loginRequestDTO: LoginRequestDTO): Promise<User> {
    const { email, password } = loginRequestDTO;
    const user = await this.validateUser(email, password);

    if (user && !user?.isActive) {
      throw new ForbiddenException('Please contact to support for more details');
    }

    if (user) {
      return user;
    }

    throw new UnauthorizedException('Invalid username or password');
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ email });

    if (user && (await this.bcryptService.comparePassword(pass, user?.password ?? ''))) {
      return user;
    }

    return null;
  }
}
