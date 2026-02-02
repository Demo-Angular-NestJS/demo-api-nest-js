
import { Injectable } from '@nestjs/common';
import { BaseService, StringService } from 'common';
import { User } from './schemas/user.schema';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserResponseDTO> {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly stringService: StringService,
  ) {
    super(userRepository, UserResponseDTO);
  }
}
