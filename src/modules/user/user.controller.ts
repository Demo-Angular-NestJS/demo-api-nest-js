import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserSearchCriteriaDTO } from './dto/user-search-criteria.dto';
import { SearchResponseDTO } from 'src/models/search-response.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { Document } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(@Query() query: UserSearchCriteriaDTO) {
    const result = await this.userService.findAll(query);
    const userInstances = result.data.map(
      (user) => new UserResponseDTO(user instanceof Document ? user.toObject() : user)
    );

    return new SearchResponseDTO(userInstances, result.meta);
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return new UserResponseDTO(user.toObject());
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    const updated = await this.userService.update(id, updateUserDTO);
    return new UserResponseDTO(updated.toObject());
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
