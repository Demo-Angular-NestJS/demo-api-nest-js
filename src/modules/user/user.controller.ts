import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { UserService } from './user.service';
import { ParseObjectIdPipe, Public, SearchRequestDTO, SearchResponseDTO } from 'common';
import type { AuthenticatedRequestModel } from 'common/models';
import { UserResponseDTO } from './dto/user-response.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CheckExistenceResponseDTO } from './dto/check-exist-response.dto.model';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  public async findAll(@Query() query: SearchRequestDTO) {
    const result = await this.userService.findAll(query);
    const userInstances = result.data.map(
      (user) => new UserResponseDTO(user instanceof Document ? user.toObject() : user)
    );

    return new SearchResponseDTO(userInstances, result.meta);
  }

  @Public()
  @Get('exists')
  public async checkExistence(
    @Query('userName') userName?: string,
    @Query('email') email?: string,
  ) {
    const resp = await this.userService.checkUserExists(userName, email);
    return new CheckExistenceResponseDTO(resp);
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.userService.findOne({ _id: new Types.ObjectId(id) });
  }

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDTO,
    @Req() req: AuthenticatedRequestModel,
  ) {
    return await this.userService.create(createUserDto, req?.user?.sub);
  }

  @Public()
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDTO,
  ) {
    const created = await this.userService.create(createUserDto);
    return new UserResponseDTO(created);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
    @Req() req: AuthenticatedRequestModel,
  ) {
    return await this.userService.update({ _id: id }, updateUserDto, req?.user?.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.userService.delete({ _id: id });
  }
}
