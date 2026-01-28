import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserSearchCriteriaDTO } from './dto/user-search-criteria.dto';
import { SearchResponseDTO } from 'src/models/search-response.dto';
import { User } from './schemas/user.schema';
import { PaginationMetaDTO } from 'src/models/pagination-meta.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async findAll(query: UserSearchCriteriaDTO): Promise<SearchResponseDTO<User>> {
    const { data, total } = await this.userRepository.findAll(query);

    // inside the service method
    // const mappedData = data.map(user => ({
    //   id: user._id.toString(),
    //   username: user.userName,
    //   email: user.email,
    // }));

    const meta: PaginationMetaDTO = {
      totalItems: total,
      itemCount: data.length,
      itemsPerPage: query.limit,
      totalPages: Math.ceil(total / query.limit),
      currentPage: query.page,
    };

    return new SearchResponseDTO(data, meta);
  }
  // async getAll(page: number = 1, limit: number = 10) {
  //   const skip = (page - 1) * limit;

  //   // Run query and count in parallel for better performance
  //   const [users, total] = await Promise.all([
  //     this.userRepository.findAll(limit, skip),
  //     this.userRepository.countAll(),
  //   ]);

  //   return {
  //     data: users,
  //     meta: {
  //       totalItems: total,
  //       currentPage: page,
  //       totalPages: Math.ceil(total / limit),
  //       itemsPerPage: limit,
  //     },
  //   };
  // }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ _id: id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(createUserDTO: Omit<CreateUserDTO, '_id'>) {
    const existing = await this.userRepository.findOne({ email: createUserDTO.email });
    if (existing) {
      throw new ConflictException('User already exists');
    }
    return this.userRepository.create(createUserDTO);
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    const user = await this.userRepository.findOneAndUpdate({ _id: id }, updateUserDTO);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string) {
    const deleted = await this.userRepository.delete({ _id: id });
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
